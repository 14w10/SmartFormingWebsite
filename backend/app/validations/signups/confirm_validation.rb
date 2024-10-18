# frozen_string_literal: true

module Signups
  ConfirmValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def confirmation_token_exists?(value)
        Signup.exists?(confirmation_token: value)
      end
    end

    required(:token).filled(:str?, :confirmation_token_exists?)
  end
end
