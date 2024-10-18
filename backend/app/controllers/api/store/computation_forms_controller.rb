# frozen_string_literal: true

module Api
  module Store
    class ComputationFormsController < Api::BaseController
      include Concerns::Api::ComputationFormable

      def show
        render json: { 
          data: computation_form_data(computation_form), 
          meta: {
            links: links
          }
        }
      end

      private

      def links
        data ={"id"=>"8c3f78e213dbe84aec0064c178465a25.psm", "storage"=>"store", "metadata"=>{"filename"=>"PAM-STAMP.psm", "size"=>5316, "mime_type"=>nil}}
        attachment = Attachment.new(file_data: data)
        disposition = "attachment; filename=#{attachment.file.original_filename.inspect}"

        links_array = [
          {
            link: attachment.file.url(response_content_disposition: disposition),
            title: attachment.file.original_filename,
            description: "PSM File"
          }
        ]
        index = 1

        4.times do
          links_array << {
            link: 'https://my-bucket.s3.amazonaws.com/6bfafe89748ee135.jpg',
            title: "My title #{index}",
            description: "This is my description #{index}"
          }
          index += 1
        end
        
        links_array
      end

      def computation_form
        @computation_form ||= ComputationForm.find(params[:id])
      end
    end
  end
end
