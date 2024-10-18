# frozen_string_literal: true

module Api
  module Admin
    class ComputationRequestsController < Api::Admin::BaseController
      include AutoInject[
        file: 'services.computation_requests.admins.file',
        filter: 'queries.computation_requests.filter',
        serializer: 'serializers.computation_request',
        update_computation_request: 'services.computation_requests.admins.update',
        update_validation: 'validations.computation_requests.admins.update_validation'
      ]

      def index
        render json: serializer.new(
          records_per_page, meta: meta(records_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        respond_to do |want|
          want.json do
            case params['type']
            when 'file'
              send_data(
                file.(computation_request, true),
                type: 'application/json',
                filename: 'data.json'
              )
            when 'file_results'
              send_data(
                File.read(computation_request&.computation_result&.file_data),
                type: 'application/zip',
                filename: 'results.zip'
              )
            else
              render json: serializer.new(
                computation_request, include: include
              ).serialized_json, status: :ok
            end
          end
        end
      end

      def update
        if validation.success?
          update_params = computation_request_params
          update_params = computation_request_params.merge(attachment_attributes: attachment_params) unless attachment_params.blank?

          record = update_computation_request.(
            computation_request,
            update_params
          )
          render json: serializer.new(
            record, include: include
          ).serialized_json, status: :ok
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private

      def computation_request_params
        params.required(:computation_request).permit(
          :decline_reason,
          :status,
          :graph_type,
          attachment_attributes: attachment_attributes
        ).to_h


      end

      def attachment_params
        computation_request_params.fetch(:attachment_attributes, {}).transform_values! do |value|
          value.respond_to?(:underscore) ? value.underscore : value
        end
      end

      def attachment_attributes
        [
          :file_type,
          file: [:id, :storage, metadata: [:size, :filename, :mime_type]]
        ]
      end

      def filter_params
        params.slice(
          :search,
          :status
        ).to_unsafe_h
      end

      def computation_request
        @computation_request ||= ComputationRequest.find(params[:id])
      end

      def computation_requests
        @computation_requests ||= filter.(filter_params)
      end

      def records_per_page
        @records_per_page ||= paginate(computation_requests.order(order_params))#.preload(*include)
      end

      def include
        [
          :attachment,
          :'computation_form.computation_module',
          :author
        ]
      end

      def validation
        @validation ||= update_validation.with(record: computation_request).(
          computation_request_params.merge(computation_request_id: computation_request.id)
        )
      end
    end
  end
end
