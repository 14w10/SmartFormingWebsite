# frozen_string_literal: true

module PortfolioModules
  UpdateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def title_uniq?(value)
        !PortfolioModule.where(title: value).exists?
      end
    end

    optional(:title).maybe(:str?, :title_uniq?, :title_size?, :present?)
    optional(:description).maybe(:str?, :present?)
  end
end
