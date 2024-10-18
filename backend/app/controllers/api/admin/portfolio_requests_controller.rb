# frozen_string_literal: true

module Api
  module Admin
    class PortfolioRequestsController < Api::Admin::BaseController
      include AutoInject[
        filter: 'queries.portfolio_requests.filter',
        serializer: 'serializers.portfolio_request'
      ]

      def index
        render json: serializer.new(
          records_per_page, meta: meta(records_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          portfolio_request, include: [
            :author,
            :portfolio_module,
            :portfolio_computation_requests,
            :'portfolio_computation_requests.attachment',
            :'portfolio_computation_requests.computation_result',
            :'portfolio_computation_requests.computation_form.computation_module'
          ]
        ).serialized_json, status: :ok
      end

      private

      def filter_params
        params.slice(
          :search,
          :status
        ).to_unsafe_h
      end

      def portfolio_request
        @portfolio_request ||= PortfolioRequest.find(params[:id])
      end

      def portfolio_requests
        @portfolio_requests ||= filter.(filter_params)
      end

      def records_per_page
        @records_per_page ||= paginate(portfolio_requests.order(order_params)).preload(*include)
      end

      def include
        [
          :author
        ]
      end
    end
  end
end
