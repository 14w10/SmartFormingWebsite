# frozen_string_literal: true

module PortfolioModules
  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def title_uniq?(value)
        !PortfolioModule.where(title: value).exists?
      end

      def computation_module_exists?(value)
        ComputationModule.exists?(value)
      end
    end

    required(:title).filled(:str?, :title_uniq?, :title_size?, :present?)
    required(:description).filled(:str?, :present?)
    required(:author_id).filled(:int?, :user_exists?)

    # required(:portfolio_computation_modules_attributes).each do
    #   required(:computation_module_id).maybe(:int?, :computation_module_exists?)
    # end
  end
end
