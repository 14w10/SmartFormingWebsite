# frozen_string_literal: true

module Api
  class ComputationModulesController < Api::BaseController
    include AutoInject[
      computation_modules_query: 'queries.computation_modules.by_author',
      create_module_validation: 'validations.computation_modules.create_validation',
      create_module: 'services.computation_modules.create',
      filter: 'queries.computation_modules.filter',
      update_module_validation: 'validations.computation_modules.update_validation',
      update_module: 'services.computation_modules.update',
      serializer: 'serializers.computation_module'
    ]

    def index
      render json: serializer.new(
        computation_modules_per_page, meta: meta(computation_modules_per_page), include: include
      ).serialized_json, status: :ok
    end

    def create
      if create_validation.success?
        create_params = computation_module_params.merge(
          attachments_attributes: attachment_params,
          datasets_attributes: dataset_params
        )

        record = create_module.(create_params)
        render json: serializer.new(
          record, include: include
        ).serialized_json, status: :created
      else
        render_json_errors(create_validation.errors, :unprocessable_entity)
      end
    end

    def show
      render json: serializer.new(
        computation_module, include: include
      ).serialized_json, status: :ok
    end

    def update
      if update_validation.success?
        update_params = computation_module_params.except(:author_id)
        update_params.merge!(
          attachments_attributes: attachment_params
        ) if computation_module_params[:attachments_attributes]
        if computation_module_params[:datasets_attributes]
          computation_module_params.merge!(
            datasets_attributes: dataset_params
          )
        end
        record = update_module.(computation_module, update_params)
        render json: serializer.new(
          record, include: include
        ).serialized_json, status: :ok
      else
        render_json_errors(update_validation.errors, :unprocessable_entity)
      end
    end

    private

    def computation_module_params
      params.require(:computation_module).permit(
        :author_id,
        :category_id,
        :short_description,
        :description,
        :title,
        :module_type,
        :module_content_type,
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
        :status
      ).to_unsafe_h
    end

    def computation_module
      @computation_module ||= computation_modules_query.(current_user.id).find(params[:id])
    end

    def computation_modules
      @computation_modules ||=
        filter.(filter_params, computation_modules_query.(current_user.id))
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
