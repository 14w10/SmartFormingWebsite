# frozen_string_literal: true

module Api
  class PortfolioRequestsController < Api::BaseController
    include AutoInject[
      filter: 'queries.portfolio_modules.filter',
      serializer: 'serializers.computation_request'
    ]

    def index
      render json: serializer.new(
        portfolio_requests, meta: meta(portfolio_requests), include: include
      ).serialized_json, status: :ok
    end

    private

    def portfolio_request_params
      params.require(:portfolio_request).to_unsafe_h
    end

    def portfolio_module
      @portfolio_module ||= PortfolioModule.find(params[:portfolio_module_id])
    end

    def portfolio_requests
      @portfolio_requests ||= paginate(portfolio_module.portfolio_requests)
    end


    def include
      [
        :author
      ]
    end
  end
end
