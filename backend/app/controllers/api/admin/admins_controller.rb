# frozen_string_literal: true

module Api
  module Admin
    class AdminsController < Api::Admin::BaseController
      include AutoInject[
        create_validation: 'validations.users.admins.create_validation',
        create_admin: 'services.users.admins.create',
        filter: 'queries.users.filter',
        serializer: 'serializers.admin'
      ]

      before_action(only: :create) { authorize_admin! }

      def index
        render json: serializer.new(
          users_per_page, meta: meta(users_per_page)
        ).serialized_json, status: :ok
      end

      def create
        if validation.success?
          admin = create_admin.(admin_params.merge(role: :admin))
          render json: serializer.new(admin).serialized_json, status: :created
        else
          render_json_errors(validation.errors, :unprocessable_entity)
        end
      end

      def show
        render json: serializer.new(
          user, include: include
        ).serialized_json, status: :ok
      end

      private

      def admin_params
        params.require(:admin).permit(
          :first_name,
          :last_name,
          :email
        ).to_h
      end

      def filter_params
        params.slice(
          :search
        ).to_unsafe_h
      end

      def user
        @user ||= User.admin.find(params[:id])
      end

      def users
        @users ||= filter.(filter_params, User.admin)
      end

      def users_per_page
        @users_per_page ||= paginate(users.order(order_params))
      end

      def validation
        create_validation.(admin_params)
      end
    end
  end
end
