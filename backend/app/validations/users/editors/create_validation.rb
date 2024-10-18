# frozen_string_literal: true

module Users
  module Editors
    CreateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        def email_uniq?(value)
          !User.where(email: value).exists?
        end
      end

      required(:first_name).filled(:str?, :name?, :present?)
      required(:last_name).filled(:str?, :name?, :present?)
      required(:email).filled(:str?, :email?, :email_uniq?)
    end
  end
end
