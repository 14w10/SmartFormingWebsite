# frozen_string_literal: true

module Signups
  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def titled?(value)
        Signup.titles[value].present?
      end

      def organization_busineses_present?(value)
        Signup.organization_businesses[value].present?
      end

      def signup_uniq?(email)
        !Signup.where(email: email, status: :new).exists?
      end

      def user_exists?(value)
        !User.find_by(email: value)
      end
    end

    required(:title).filled(:str?, :titled?, :present?)
    required(:first_name).filled(:str?, :name?, :present?)
    required(:last_name).filled(:str?, :name?, :present?)
    required(:email).filled(:str?, :email?, :signup_uniq?, :user_exists?)
    required(:phone_number).filled(:str?, :present?)

    required(:password).filled(min_size?: MIN_PASSWORD_LENGTH)
    required(:password_confirmation).filled(min_size?: MIN_PASSWORD_LENGTH)

    required(:organization_name).filled(:str?, :present?)
    required(:organization_address).filled(:str?, :present?)
    required(:organization_postcode).filled(:str?, :present?)
    required(:organization_country).filled(:str?, :present?)

    optional(:position).maybe(:str?, :present?)
    optional(:role).maybe(:str?, :present?)
    optional(:organization_business).maybe(:str?, :organization_busineses_present?, :present?)
    optional(:website).maybe(:str?, :link?, :present?)
    optional(:linkedin).maybe(:str?, :link?, :present?)
    optional(:research_gate).maybe(:str?, :link?, :present?)
    optional(:other_link).maybe(:str?, :link?, :present?)

    validate(password_confirmation: [:password_confirmation, :password]) do |confirmation, password|
      confirmation == password
    end
  end
end
