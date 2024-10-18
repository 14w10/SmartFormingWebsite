# frozen_string_literal: true

module Api
  module Admin
    class ComputationModulesController < Api::Admin::BaseController
      include AutoInject[
        create_module_validation: 'validations.computation_modules.admins.create_validation',
        create_admin_module: 'services.computation_modules.admins.create',
        filter: 'queries.computation_modules.filter',
        update_module_validation: 'validations.computation_modules.admins.update_validation',
        update_module: 'services.computation_modules.admins.update',
        destroy_module: 'services.computation_modules.admins.destroy',
        serializer: 'serializers.computation_module'
      ]

      def index
        render json: serializer.new(
          computation_modules_per_page, meta: meta(computation_modules_per_page), include: include
        ).serialized_json, status: :ok
      end

      def copy
        computation_module

        operation = ComputationModuleCloner.(computation_module)
        operation.to_record
        operation.persist!

        render json: serializer.new(
          operation.to_record, include: include, params: { meta: true }
        ).serialized_json, status: :ok
      end

      def create
        if create_validation.success?
          create_params = computation_module_params.merge(
            attachments_attributes: attachment_params
          )
          record = create_admin_module.(create_params)
          render json: serializer.new(
            record, include: include
          ).serialized_json, status: :created
        else
          render_json_errors(create_validation.errors, :unprocessable_entity)
        end
      end

      def show
        render json: serializer.new(
          computation_module, include: include, params: { meta: true }
        ).serialized_json, status: :ok
      end

      def update
        if update_validation.success?
          module_params = computation_module_params.except(:author_id)
          if computation_module_params[:attachments_attributes]
            module_params.merge!(
              attachments_attributes: attachment_params
            )
          end
          if computation_module_params[:datasets_attributes]
            module_params.merge!(
              datasets_attributes: dataset_params
            )
          end
          record = update_module.(computation_module, module_params)
          render json: serializer.new(
            record, include: include
          ).serialized_json, status: :ok
        else
          render_json_errors(update_validation.errors, :unprocessable_entity)
        end
      end

      def destroy
        destroy_module.(computation_module)
        render status: :no_content
      end

      private

      def computation_module_params
        params.require(:computation_module).permit(
          :author_id,
          :short_description,
          :description,
          :category,
          :status,
          :title,
          :uid,
          :category_id,
          :module_type,
          :reject_reason,
          # its for nil value for deletion
          :cover,
          keywords: [],
          cover: [
            :id,
            :storage,
            metadata: [
              :filename,
              :size,
              :mime_type,
              crop: [
                :x,
                :y,
                :width,
                :height
              ]
            ]
          ],
          attachments_attributes: attachments_attributes,
          datasets_attributes: datasets_attributes
        ).to_h
      end

      def attachment_params
        computation_module_params.fetch(:attachments_attributes, []).map do |attribute|
          attribute.transform_values! do |value|
            value.respond_to?(:underscore) ? value.underscore : value
          end
        end
      end

      def dataset_params
        computation_module_params.fetch(:datasets_attributes, []).map do |attribute|
          attribute.transform_values! do |value|
            value.respond_to?(:underscore) ? value.underscore : value
          end
        end
      end

      def attachments_attributes
        [
          :id,
          :_destroy,
          :file_type,
          file: [:id, :storage, metadata: [:size, :filename, :mime_type]]
        ]
      end

      def datasets_attributes
        [
          :id,
          :_destroy,
          :paid,
          :price,
          file: [:id, :storage, metadata: [:size, :filename, :mime_type]]
        ]
      end

      def filter_params
        params.slice(
          :search,
          :module_type,
          :status,
          :category_id
        ).to_unsafe_h
      end

      def computation_module
        @computation_module ||= ComputationModule.find(params[:id])
      end

      def computation_modules
        @computation_modules ||= filter.(filter_params)
      end

      def computation_modules_per_page
        @computation_modules_per_page ||=
          paginate(computation_modules.order(order_params)).preload(*include)
      end

      def include
        [
          :attachments,
          :datasets,
          :author
        ]
      end

      def create_validation
        create_module_validation.(computation_module_params)
      end

      def update_validation
        update_module_validation.with(record: computation_module).(computation_module_params)
      end
    end
  end
end
