# frozen_string_literal: true

module Api
  module Store
    class ComputationModulesController < Api::BaseController
      # Guest access for this page
      skip_before_action :authorize_user!

      include AutoInject[
        filter: 'queries.computation_modules.filter',
        serializer: 'serializers.store.computation_module'
      ]

      def index
        render json: serializer.new(
          computation_modules_per_page, meta: meta(computation_modules_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          computation_module, include: include
        ).serialized_json, status: :ok
      end

      private

      def filter_params
        params.slice(
          :search,
          :module_type,
          :category_id,
          :on_main_page
        ).to_unsafe_h
      end

      def computation_module
        @computation_module ||= ComputationModule.where(status: :published).find(params[:id])
      end

      def computation_modules
        @computation_modules ||= filter.(filter_params.merge(status: :published))
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
    end
  end
end
