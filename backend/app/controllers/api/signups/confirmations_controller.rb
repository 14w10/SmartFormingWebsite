# frozen_string_literal: true

module Api
  module Signups
    class ConfirmationsController < Api::BaseController
      include AutoInject[
        confirm_validation: 'validations.signups.confirm_validation',
        update_signup: 'services.signups.update'
      ]

      skip_before_action :authorize_user!

      def create
        if validation.success?
          update_signup.(signup, { status: 'approve' })
          render json: {}, status: :ok
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private

      def confirm_params
        params.require(:signup).permit(:token).to_h
      end
      
      def validation
        confirm_validation.(confirm_params)
      end

      def signup
        @signup ||= Signup.find_by(confirmation_token: confirm_params[:token])
      end
    end
  end
end
