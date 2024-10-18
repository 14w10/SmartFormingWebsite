# frozen_string_literal: true

module Api
  module Admin
    class CategoriesController < Api::Admin::BaseController
      include AutoInject[
          create_category_validation: 'validations.categories.admins.create_validation',
          update_category_validation: 'validations.categories.admins.update_validation',

          create_category: 'services.categories.admins.create',
          update_category: 'services.categories.admins.update',
          destroy_category: 'services.categories.admins.destroy',

          serializer: 'serializers.category'
        ]

      def index
        render json: serializer.new(
          categories_per_page, meta: meta(categories_per_page)
        ).serialized_json, status: :ok
      end

      def create
        if create_validation.success?
          category = create_category.(category_params)
          render json: serializer.new(category).serialized_json, status: :created
        else
          render_json_errors(create_validation.errors, :unprocessable_entity)
        end
      end

      def show
        render json: serializer.new(
          category
        ).serialized_json, status: :ok
      end

      def update
        if update_validation.success?
          record = update_category.(category, category_params)
          render json: serializer.new(record).serialized_json, status: :ok
        else
          render_json_errors(update_validation.errors, :unprocessable_entity)
        end
      end

      def destroy
        destroy_category.(category)
      rescue ActiveRecord::InvalidForeignKey
        render_json_error(I18n.t('errors.category_can_not_be_removed'), :unprocessable_entity)
      else
        render status: :no_content
      end

      private

      def category_params
        params.require(:category).permit(
          :name,
          icon: [
            :id,
            :storage,
            metadata: [
              :filename,
              :size,
              :mime_type
            ]
          ],
          computation_modules_attributes: [
            :id,
            :on_main_page
          ]
        ).to_h
      end

      def categories
        @categories ||= Category.all
      end

      def categories_per_page
        @categories_per_page ||= paginate(categories.order(order_params))
      end

      def category
        @category ||= Category.find(params[:id])
      end

      def create_validation
        create_category_validation.(category_params)
      end

      def update_validation
        update_category_validation.with(record: category).(category_params)
      end
    end
  end
end
