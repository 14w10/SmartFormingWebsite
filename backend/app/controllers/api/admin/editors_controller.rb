# frozen_string_literal: true

module Api
  module Admin
    class EditorsController < Api::Admin::BaseController
      include AutoInject[
        create_validation: 'validations.users.editors.create_validation',
        create_editor: 'services.users.editors.create',
        filter: 'queries.users.filter',
        serializer: 'serializers.editor'
      ]

      def index
        render json: serializer.new(
          users_per_page, meta: meta(users_per_page)
        ).serialized_json, status: :ok
      end

      def create
        if validation.success?
          editor = create_editor.(editor_params.merge(role: :editor))
          render json: serializer.new(editor).serialized_json, status: :created
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

      def editor_params
        params.require(:editor).permit(
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
        @user ||= User.editor.find(params[:id])
      end

      def users
        @users ||= filter.(filter_params, User.editor)
      end

      def users_per_page
        @users_per_page ||= paginate(users.order(order_params))
      end

      def validation
        create_validation.(editor_params)
      end
    end
  end
end
