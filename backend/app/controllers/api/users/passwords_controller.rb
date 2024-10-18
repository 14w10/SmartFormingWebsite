# frozen_string_literal: true

module Api
  module Users
    class PasswordsController < Devise::PasswordsController
      skip_before_action :authorize_user!

      def create
        self.resource = resource_class.send_reset_password_instructions(resource_params)
        render json: {}, status: 201
      end

      def update
        self.resource = resource_class.reset_password_by_token(resource_params)

        if resource.errors.empty? && validation.success?
          render json: {}, status: :ok
        else
          render_json_errors(errors, :unprocessable_entity)
        end
      end

      protected

      def validation
        @validation ||= ::Users::Passwords::UpdateValidation.(resource_params.to_unsafe_h)
      end

      def errors
        @errors ||= validation.errors.merge(resource.errors.to_h)
      end
    end
  end
end
