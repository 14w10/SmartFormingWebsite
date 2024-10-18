# frozen_string_literal: true

module PortfolioRequests
  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def portfolio_module_exists?(value)
        PortfolioModule.find_by(id: value)&.published?
      end
    end

    required(:author_id).filled(:int?, :user_exists?)
    required(:portfolio_module_id).filled(:int?, :portfolio_module_exists?)
  end
end
