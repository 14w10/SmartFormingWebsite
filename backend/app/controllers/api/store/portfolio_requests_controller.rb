# frozen_string_literal: true

module Api
  module Store
    class PortfolioRequestsController < Api::BaseController
      include AutoInject[
        create_portfolio_request: 'services.portfolio_requests.create',
        serializer: 'serializers.store.portfolio_request'
      ]

      
      def create
        record = create_portfolio_request.(
          portfolio_module,
          portfolio_request_params.except(:portfolio_module_id, :attachment_attributes)
        )
        
        render json: serializer.new(
          record, include: include
        ).serialized_json, status: :created
      end

      private

      def portfolio_request_params
        params.require(:portfolio_request).to_unsafe_h
      end

      def portfolio_module
        @portfolio_module ||= PortfolioModule.find(params[:portfolio_module_id])
      end

      def include
        [
          :author,
          :portfolio_module
        ]
      end
    end
  end
end
