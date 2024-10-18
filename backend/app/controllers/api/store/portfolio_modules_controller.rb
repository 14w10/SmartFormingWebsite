# frozen_string_literal: true

module Api
  module Store
    class PortfolioModulesController < Api::BaseController
      # Guest access for this page
      skip_before_action :authorize_user!

      include AutoInject[
        filter: 'queries.portfolio_modules.filter',
        serializer: 'serializers.store.portfolio_module'
      ]

      def index
        render json: serializer.new(
          portfolio_modules_per_page, meta: meta(portfolio_modules_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          portfolio_module, include: include
        ).serialized_json, status: :ok
      end

      private

      def filter_params
        params.slice(
          :search
        ).to_unsafe_h
      end

      def portfolio_module
        @portfolio_module ||= PortfolioModule.where(status: :published).find(params[:id])
      end

      def portfolio_modules
        @portfolio_modules ||= filter.(filter_params.merge(status: :published))
      end

      def portfolio_modules_per_page
        @portfolio_modules_per_page ||=
          paginate(portfolio_modules.order(order_params))#.preload(*include)
      end

      def include
        [
          :author,
          :coauthors,
          :'portfolio_computation_modules.computation_module.attachments'
        ]
      end
    end
  end
end
