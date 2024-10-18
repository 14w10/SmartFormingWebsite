# frozen_string_literal: true

module Api
  module Admin
    class SignupsController < Api::Admin::BaseController
      include AutoInject[
        filter: 'queries.signups.filter',
        update_validation: 'validations.signups.update_validation',
        update_signup: 'services.signups.update',
        serializer: 'serializers.signup'
      ]

      def index
        render json: serializer.new(
          signups_per_page, meta: meta(signups_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          signup, include: include
        ).serialized_json, status: :ok
      end

      def update
        if validation.success?
          record = update_signup.(signup, signup_params.merge(email: signup.email))
          render json: serializer.new(
            record, include: include
          ).serialized_json, status: :ok
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      private

      def signup_params
        params.require(:signup).permit(
          :decline_reason,
          :status
        ).to_h
      end

      def filter_params
        params.slice(
          :search,
          :status
        ).to_unsafe_h
      end

      def signup
        @signup ||= Signup.find(params[:id])
      end

      def signups
        @signups ||= filter.(filter_params)
      end

      def signups_per_page
        @signups_per_page ||= paginate(signups.order(order_params)).preload(*include)
      end

      def include
        [
          :user
        ]
      end

      def validation
        update_validation.(signup_params)
      end
    end
  end
end
