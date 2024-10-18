# frozen_string_literal: true

module PortfolioRequests
  class Create
    def call(portfolio_module, params)
      request = nil
      
      ActiveRecord::Base.transaction do
        request = portfolio_module.portfolio_requests.create!(params.except(:portfolio_computation_request_ids))
        params[:portfolio_computation_request_ids].each do |id|
          PortfolioComputationRequest.find(id).update!({ portfolio_request_id: request.id })
        end
      end

      request
    end
  end
end
