# frozen_string_literal: true

module Api
  module Users
    class SessionsController < Devise::SessionsController
      skip_before_action :authorize_user!

      def create
        self.resource = warden.authenticate!(auth_options)
        sign_in(resource_name, resource)
        render json: UserSerializer.new(current_user).serialized_json, status: :ok
      end

      def show
        authenticate_user!(force: true)
        render json: UserSerializer.new(current_user).serialized_json, status: :ok
      end

      def destroy
        current_user.invalidate_all_sessions!
        sign_out(resource_name)
        render nothing: true, status: :ok
      end
    end
  end
end
