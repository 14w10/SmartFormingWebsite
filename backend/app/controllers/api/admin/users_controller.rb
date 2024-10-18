# frozen_string_literal: true

module Api
  module Admin
    class UsersController < Api::Admin::BaseController
      include AutoInject[
        filter: 'queries.users.filter',
        serializer: 'serializers.user'
      ]

      def index
        render json: serializer.new(
          users_per_page, meta: meta(users_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        render json: serializer.new(
          user, include: include
        ).serialized_json, status: :ok
      end

      private

      def filter_params
        params.slice(
          :search
        ).to_unsafe_h
      end

      def user
        @user ||= users.find(params[:id])
      end

      def users
        @users ||= filter.(filter_params, User.user)
      end

      def users_per_page
        @users_per_page ||= paginate(users.order(order_params)).preload(*include)
      end

      def include
        [
          :signup
        ]
      end
    end
  end
end
