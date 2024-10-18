require "uri"
require "net/http"
require 'zip'
require 'csv'

module BaseRequests
  class ProcessData
    def call(base_request)
      unless Rails.env.development?
        post_url = ENV.fetch('PYTHON_SERVER_URL') { 'http://pythonsend:5000' } 
        file_content_type = 'application/octet-stream'
        data = ::ComputationRequests::Admins::File.new.call(base_request)
        computation_module = base_request.computation_form.computation_module
        
        filename = "#{ComputationModuleDecorator.new(computation_module).module_type}_84.json"

        multi_part = MultipartPost.new post_url do
          params_part 'filename', filename
          files_part(filename, filename, file_content_type, data)
          
          if base_request.attachment
            zip_data = base_request.attachment.file.read
            zip_filename = base_request.attachment.file.original_filename
            params_part 'zip_filename', zip_filename
            files_part(zip_filename, zip_filename, file_content_type, zip_data)
          end
        end

        response = MultipartResponse.new(multi_part.run)
      end

      data = { error: 'No response from python' }
      request_params =  { data: data }
      
      if response.success?
        json_data = response.json_body
        if json_data.key?(:error)
          request_params[:data] = { error: json_data[:error] }
        else
          if ComputationModuleDecorator.new(base_request.computation_form.computation_module).ihtc?
            json_data.merge!(files: [{ filename: "ihtc_results.csv", data: ihtc_file_data(json_data) }])

            figure_data = {
              data: [json_data[:psf_matrix].merge({ type: 'scatter' })],
              layout: {
                title: 'IHTC',
                xaxis: {
                  title: json_data[:labels][:x]
                },
                yaxis: {
                  title: json_data[:labels][:y]
                }
              }
            }
            json_data.merge!(figures: [{ figurename: "ihtc_results", figure: figure_data }])
          end

          request_params[:data] = json_data[:figures].first[:figure] if json_data[:figures]
          request_params[:file_data] = zip_uploader(json_data[:files], json_data[:figures]) unless json_data[:files].blank?
        end
      end

      if cr = base_request.computation_result
        cr.update(request_params)
      else
        base_request.create_computation_result(request_params)
      end
    end

    private

    def base64?(value)
      value.is_a?(String) && Base64.strict_encode64(Base64.decode64(value)) == value
    end

    def ihtc_file_data(data)
      data = Hash[data[:labels].collect { |axis, item| [item, data[:psf_matrix][axis]] } ]

      out = []
      out << data.keys

      out + data.values.first.zip(data.values.last)
    end

    def zip_uploader(files, figures)
      zipfile_name = Rails.root.join('public', "results_#{SecureRandom.hex(10)}.zip")
      stringio = Zip::OutputStream.write_buffer do |zio|
        files.each do |f|
          filedata = nil
          if f[:data].kind_of?(Array)
            filedata = f[:data].inject([]) { |csv, row|  csv << CSV.generate_line(row) }.join("")
          elsif base64?(f[:data])
            filedata = Base64.decode64(f[:data])
          elsif f[:data].kind_of?(String)
            filedata = f[:data]
          end
          
          zio.put_next_entry(f[:filename])
          zio.write(filedata)
        end

        unless figures.blank?
          html_template = File.read('html_figure.template')
          figures.each do |figure|
            zio.put_next_entry("#{figure[:figurename]}.html")
            zio.write(html_template.gsub(/%<jsondata>s/, figure[:figure].to_json))
          end 
        end
      end
      
      stringio.rewind
      uploader = AttachmentUploader.new(:store)
      uploaded_file = uploader.upload(stringio)
      
      JSON.parse(uploaded_file.to_json)
    end
  end

  class MultipartResponse
    attr_reader :response
    
    def initialize(response)
      @response = response
    end
    
    def success?
      response.code.to_i >= 200 && response.code.to_i < 300
    end

    def json_body
      return {} unless success?

      JSON.parse(response.body).deep_symbolize_keys[:data]
    end

    def xml_body
      return {} unless success?
      out = JSON.parse(response.body).deep_symbolize_keys      
      Hash.from_xml(out[:data]).deep_symbolize_keys
    end
  end

  class MultipartPost
    BOUNDARY = "-----------RubyMultipartPost"
    EOL = "\r\n"
  
    def initialize uri, &block
      @params = Array.new
      @uri = URI.parse uri
      instance_eval &block if block
    end
  
    def params_part key, value
      @params << multipart_text(key, value)
    end
  
    def files_part key, filename, mime_type, content
      @params << multipart_file(key, filename, mime_type, content)
    end
  
    def request_body
      body = @params.map{|p| "--#{BOUNDARY}#{EOL}" << p}.join ""
      body << "#{EOL}--#{BOUNDARY}--#{EOL}"
    end
  
    def run
      http = Net::HTTP.new @uri.host, @uri.port
      http.read_timeout = 1200 # seconds

      request = Net::HTTP::Post.new @uri.request_uri
      request.body = request_body
      request.set_content_type "multipart/form-data", {"boundary" => BOUNDARY}
      http.request(request)
    end
  
    private
    def multipart_text key, value
      content = "Content-Disposition: form-data; name=\"#{key}\"" <<
        EOL <<
        EOL <<
        "#{value}" << EOL
    end
  
    def multipart_file key, filename, mime_type, content
      content = "Content-Disposition: form-data; name=\"#{key}\"; filename=\"#{filename}\"#{EOL}" <<
        "Content-Type: #{mime_type}\r\n" <<
        EOL <<
        "#{content}" << EOL
    end
  end
end
