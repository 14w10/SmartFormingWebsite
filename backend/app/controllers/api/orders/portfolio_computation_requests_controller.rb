# frozen_string_literal: true

module Api
  module Orders
    class PortfolioComputationRequestsController < Api::BaseController
      include AutoInject[
        serializer: 'serializers.computation_request'
      ]

      def show
        render json: serializer.new(
          portfolio_computation_request, include: include
        ).serialized_json, status: :ok
      end

      private

      def portfolio_computation_request
        @portfolio_computation_request ||= PortfolioComputationRequest.where(author_id: current_user.id).find(params[:id])
      end

      def include
        [
          :author
        ]
      end
    end
  end
end
