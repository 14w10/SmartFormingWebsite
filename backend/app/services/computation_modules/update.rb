# frozen_string_literal: true

module ComputationModules
  class Update
    def call(computation_module, params)
      if params[:attachments_attributes]
        params[:attachments_attributes] = params.delete(:attachments_attributes).map do |atts|
          if atts[:file]
            atts.merge(file: atts[:file].to_json)
          else
            atts
          end
        end
      end

      if params[:datasets_attributes]
        params[:datasets_attributes] = params.delete(:datasets_attributes).map do |atts|
          if atts[:file]
            atts.merge(file: atts[:file].to_json)
          else
            atts
          end
        end
      end

      if params.key?('cover') && !params['cover'].nil?
        if params['cover'].key?('id') &&
           params['cover'].key?('metadata') &&
           !computation_module.cover_data.nil? &&
           params['cover']['id'] == computation_module.cover_data['id']
          computation_module.cover_data['metadata']['crop'] = params['cover']['metadata']['crop']
          computation_module.cover_derivatives!
        end
      end

      computation_module.update(params)

      computation_module
    end
  end
end
