# frozen_string_literal: true

module Users
  module Admins
    class Create
      def call(params)
        user = User.new(params.merge!(password: password, password_confirmation: password))
        if user.save
          DeviseMailer.admin_registration_instructions(user, password).deliver_later
          user
        end
      end

      private

      def password
        @password ||= Devise.friendly_token.first(MIN_PASSWORD_LENGTH)
      end
    end
  end
end
