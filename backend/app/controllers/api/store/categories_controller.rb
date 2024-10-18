# frozen_string_literal: true

module Api
  module Store
    class CategoriesController < Api::BaseController

      skip_before_action :authorize_user!
      
      include AutoInject[
        serializer: 'serializers.category'
      ]

      def index
        render json: serializer.new(
          categories_per_page, meta: meta(categories_per_page)
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          category
        ).serialized_json, status: :ok
      end

      private

      def category
        @category ||= Category.find(params[:id])
      end

      def categories
        @categories ||= Category.all
      end

      def categories_per_page
        @categories_per_page ||=
          paginate(categories.order(order_params))
      end
    end
  end
end