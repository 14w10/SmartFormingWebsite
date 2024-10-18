# frozen_string_literal: true

module Api
  module Orders
    class PortfolioRequestsController < Api::BaseController
      include AutoInject[
        filter: 'queries.portfolio_requests.filter',
        store_serializer: 'serializers.store.portfolio_request',
        serializer: 'serializers.portfolio_request'
      ]

      def index
        render json: store_serializer.new(
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
        @portfolio_request ||= PortfolioRequest.where(author_id: current_user.id).find(params[:id])
      end

      def serializer_class
        # if portfolio_request.approved?
        #   serializer
        # else
        #   store_serializer
        # end
        serializer
      end

      def scope
        PortfolioRequest.where(author_id: current_user.id)
      end

      def portfolio_requests
        @portfolio_requests ||= filter.(filter_params, scope)
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
