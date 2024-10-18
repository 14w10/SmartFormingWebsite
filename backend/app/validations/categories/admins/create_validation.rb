# frozen_string_literal: true

module Categories
  module Admins
    CreateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        def name_uniq?(value)
          !Category.where(name: value).exists?
        end
      end

      required(:name).filled(:str?, :name_uniq?)
      optional(:icon).filled
    end
  end
end
