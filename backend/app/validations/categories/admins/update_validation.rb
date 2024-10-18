# frozen_string_literal: true

module Categories
  module Admins
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        option :record

        def name_uniq?(value)
          !Category.where.not(id: record&.id).where(name: value).exists?
        end
      end

      required(:name).filled(:str?, :name_uniq?)
      optional(:icon).filled
    end
  end
end
