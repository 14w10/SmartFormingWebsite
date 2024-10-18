# frozen_string_literal: true

module Api
  module Orders
    class ComputationResultsController < Api::BaseController
      include AutoInject[
        serializer: 'serializers.computation_result'
      ]

      def show
        render json: serializer.new(
          computation_result
        ).serialized_json, status: :ok
      end

      private

      def computation_result
        @computation_result ||= ComputationResult.find(params[:id])
      end
    end
  end
end
