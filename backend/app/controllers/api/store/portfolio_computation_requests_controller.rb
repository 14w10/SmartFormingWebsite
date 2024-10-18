# frozen_string_literal: true

module Api
  module Store
    class PortfolioComputationRequestsController < Api::BaseController
      include AutoInject[
        create_portfolio_computation_request: 'services.portfolio_computation_requests.create',
        prepared_params: 'services.portfolio_computation_requests.prepared_params',
        data_processing: 'services.base_requests.process_data',
        serializer: 'serializers.computation_request'
      ]

      def create
        record_params = prepared_params.(params)
        record = create_portfolio_computation_request.(record_params)
        data_processing.(record)

        render json: serializer.new(
          record#, include: include
        ).serialized_json, status: :created
      end
    end
  end
end
