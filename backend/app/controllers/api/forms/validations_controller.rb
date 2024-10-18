# frozen_string_literal: true

module Api
  module Forms
    class ValidationsController < Api::BaseController
      include AutoInject[
        json_validator: 'services.json_schema_validator',
        step_validation: 'validations.computation_forms.step_validation'
      ]

      def create
        if true # validation.success?
          if true # json_validation.success?
            render json: {}, status: :created
          else
            render_json_errors(json_validation.errors, :unprocessable_entity)
          end
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private

      def validation_params
        params.required(:validation).to_unsafe_h
      end

      def step_data
        validation_params[:data].to_h
      end

      def computation_form
        @computation_form ||= ComputationForm.find(validation_params[:computation_form_id])
      end

      def schema
        computation_form.meta['steps'][validation_params[:step_id].to_i]
      end

      def tab
        schema["properties"][tab_key]
      end

      def tab_key
        step_data.keys.first
      end

      def validation
        step_validation.(validation_params.merge(step: step_data))
      end

      def json_validation
        @json_validation ||= json_validator.new(tab, step_data[tab_key])
      end
    end
  end
end
