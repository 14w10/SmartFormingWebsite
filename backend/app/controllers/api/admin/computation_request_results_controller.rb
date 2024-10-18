# frozen_string_literal: true

module Api
  module Admin
    class ComputationRequestResultsController < Api::Admin::BaseController
      include AutoInject[
        serializer: 'serializers.computation_request_result'
      ]

      def show
        render json: serializer.new(
          computation_request
        ).serialized_json, status: :ok
      end

      private

      def computation_request
        @computation_request ||= ComputationRequest.find(params[:id])
      end
    end
  end
end
