# frozen_string_literal: true

module Api
  module Admin
    class ComputationResultsController < Api::Admin::BaseController
      include AutoInject[
        serializer: 'serializers.computation_result',
        update_computation_result: 'services.computation_results.admins.update',
        update_validation: 'validations.computation_results.admins.update_validation'
      ]

      def show
        render json: serializer.new(
          computation_result
        ).serialized_json, status: :ok
      end

      def update
        if validation.success?
          record = update_computation_result.(
            computation_result,
            computation_result_params
          )
          render json: serializer.new(
            record
          ).serialized_json, status: :ok
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private
      
      def computation_result_params
        params.required(:computation_result).permit(
          parameters:[
            :type,
            :x,
            :y,
            :z,
            color: [:hex]
          ]
        ).to_h
      end

      def computation_result
        @computation_result ||= ComputationResult.find(params[:id])
      end

      def validation
        @validation ||= update_validation.with(record: computation_result).(
          computation_result_params
        )
      end
    end
  end
end
