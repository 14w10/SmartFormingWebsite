# frozen_string_literal: true

module Api
  module Store
    module ComputationModules
      class PortfolioModulesController < Api::BaseController
        # Guest access for this page
        skip_before_action :authorize_user!

        include AutoInject[
          serializer: 'serializers.store.portfolio_module'
        ]

        def index
          render json: serializer.new(
            portfolio_modules_per_page, meta: meta(portfolio_modules_per_page)
          ).serialized_json, status: :ok
        end

        private

        def computation_module
          @computation_module ||= ComputationModule.published.find(params[:id])
        end

        def portfolio_modules
          @portfolio_modules ||= computation_module.portfolio_modules.published
        end

        def portfolio_modules_per_page
          @portfolio_modules_per_page ||=
            paginate(portfolio_modules.order(order_params)) # .preload(*include)
        end

        def include
          []
        end
      end
    end
  end
end
