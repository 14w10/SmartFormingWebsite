# frozen_string_literal: true

module ComputationModules
  module Admins
    class Update
      # rubocop:disable Metrics/MethodLength
      def call(computation_module, params)
        status = params.delete(:status).try(:underscore)

        case status
        when 'under_review'
          computation_module.under_review!
          computation_module.touch(:review_started_at)
        when 'approved'
          computation_module.approved!
          computation_module.touch(:approved_at)
        when 'published'
          computation_module.published!
          computation_module.touch(:published_at)
        when 'rejected'
          computation_module.rejected!
          computation_module.touch(:rejected_at)
        end

        params[:attachments_attributes] = params.delete(:attachments_attributes).map do |atts|
          if atts[:file]
            atts.merge(file: atts[:file].to_json)
          else
            atts
          end
        end if params[:attachments_attributes]

        if params.key?("cover") && !params["cover"].nil?
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
      # rubocop:enable Metrics/MethodLength
    end
  end
end
