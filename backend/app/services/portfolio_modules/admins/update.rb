# frozen_string_literal: true

module PortfolioModules
  module Admins
    class Update
      # rubocop:disable Metrics/MethodLength
      def call(portfolio_module, params)
        status = params.delete(:status).try(:underscore)

        case status
        when 'under_review'
          portfolio_module.under_review!
          portfolio_module.touch(:review_started_at)
        when 'approved'
          portfolio_module.approved!
          portfolio_module.touch(:approved_at)
        when 'published'
          portfolio_module.published!
          portfolio_module.touch(:published_at)
        when 'rejected'
          portfolio_module.rejected!
          portfolio_module.touch(:rejected_at)
        end

        if params.key?("cover") && !params["cover"].nil?
          if params['cover'].key?('id') && 
             params['cover'].key?('metadata') && 
             !portfolio_module.cover_data.nil? && 
             params['cover']['id'] == portfolio_module.cover_data['id']
             portfolio_module.cover_data['metadata']['crop'] = params['cover']['metadata']['crop']
             portfolio_module.cover_derivatives!
          end
        end
  
        portfolio_module.update(params)
        portfolio_module
      end
      # rubocop:enable Metrics/MethodLength
    end
  end
end
