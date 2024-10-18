# frozen_string_literal: true

module Api
  module Signups
    class StepValidationsController < Api::BaseController
      include AutoInject[
        step_validation: 'validations.signups.step_validation',
      ]

      skip_before_action :authorize_user!

      def create
        if validation.success?
          render json: {}, status: :created
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private

      def signup_params
        params.require(:signup).permit(
          :title,
          :first_name,
          :last_name,
          :phone_number,
          :email,
          :password,
          :password_confirmation
        ).to_h
      end

      def validation
        step_validation.(signup_params)
      end
    end
  end
end
