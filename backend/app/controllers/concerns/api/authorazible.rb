# frozen_string_literal: true

module Concerns
  module Api
    module Authorazible
      extend ActiveSupport::Concern

      included do
        User.roles.keys.each do |role|
          define_method(:"authorize_#{role}!") do
            authorize_with!(role)
          end
        end
      end

      def authorize_admin_or_editor!
        authenticate_user!
        allowed = MANGER_ROLES.include?(current_user.role)
        raise_forbidden_error unless allowed
      end

      private

      def authorize_with!(role)
        authenticate_user!
        allowed = current_user.role == role
        raise_forbidden_error unless allowed
      end

      def raise_forbidden_error
        raise ::ApplicationController::ForbiddenError
      end
    end
  end
end
