# frozen_string_literal: true

module Api
  module Store
    class ComputationRequestsController < Api::BaseController
      include AutoInject[
        create_computation_request: 'services.computation_requests.create',
        create_validation: 'validations.computation_requests.create_validation',
        computation_request_query: 'queries.computation_requests.by_author',
        steps_validator: 'services.steps_validator',
        data_processing: 'services.base_requests.process_data',
        serializer: 'serializers.computation_request'
      ]

      def create
        if true# validation.success?
          if true# steps_validation_success?
            create_params = computation_request_params.merge(
              attachment_attributes: attachment_params
            )
            # create_params = computation_request_params
            record = create_computation_request.(computation_form, create_params)
            data_processing.(record)

            render json: serializer.new(
              record, include: include
            ).serialized_json, status: :created
          else
            render_json_error('Steps are not valid', :unprocessable_entity)
          end
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      def show
        render json: serializer.new(
          computation_request, include: include
        ).serialized_json, status: :ok
      end

      private

      def computation_request_params
        params.require(:computation_request).to_unsafe_h
      end

      def attachment_params
        computation_request_params.fetch(:attachment_attributes, {}).transform_values! do |value|
          value.respond_to?(:underscore) ? value.underscore : value
        end
      end

      def validation
        create_validation.(
          computation_request_params.merge(
            schemas: steps_schemas,
            files_schemas: files_schemas
          )
        )
      end

      def steps_validation_success?
        steps_validator.(steps_schemas, steps_data)
      end

      def steps_data
        computation_request_params[:steps]
      end

      def steps_schemas
        computation_form.meta.fetch('steps', [])
      end

      def files_schemas
        computation_form.meta.fetch('files', [])
      end

      def computation_form
        @computation_form ||= ComputationForm.find(computation_form_id)
      end

      def computation_request
        @computation_request ||= computation_request_query.(current_user.id).find(params[:id])
      end

      def computation_form_id
        computation_request_params[:computation_form_id]
      end

      def include
        [
          :attachment,
          :author
        ]
      end
    end
  end
end
