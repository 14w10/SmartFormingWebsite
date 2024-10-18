# frozen_string_literal: true

module Users
  module Passwords
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates
      end

      required(:password).filled(min_size?: MIN_PASSWORD_LENGTH)
      required(:password_confirmation).filled(min_size?: MIN_PASSWORD_LENGTH)

      validate(password_confirmation: [:password_confirmation, :password]) do |confirm, pass|
        confirm == pass
      end
    end
  end
end
