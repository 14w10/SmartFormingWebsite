# frozen_string_literal: true

module Api
  module Orders
    class ComputationRequestsController < Api::BaseController
      include AutoInject[
        file: 'services.computation_requests.admins.file',
        computation_request_query: 'queries.computation_requests.by_author',
        filter: 'queries.computation_requests.filter',
        serializer: 'serializers.computation_request'
      ]

      def index
        render json: serializer.new(
          records_per_page, meta: meta(records_per_page), include: include
        ).serialized_json, status: :ok
      end

      def show
        respond_to do |want|
          want.json do
            case params['type']
            when 'file'
              send_data(
                file.(computation_request, true),
                type: 'application/json',
                filename: 'data.json'
              )
            when 'file_results'
              send_data(
                File.read(computation_request&.computation_result&.file&.url),
                type: 'application/zip',
                filename: 'results.zip'
              )
            else
              render json: serializer.new(
                computation_request, include: include
              ).serialized_json, status: :ok
            end
          end
        end
      end

      private

      def filter_params
        params.slice(
          :search,
          :status
        ).to_unsafe_h
      end

      def computation_request
        @computation_request ||= scope.find(params[:id])
      end

      def records_per_page
        @records_per_page ||= paginate(computation_requests.order(order_params))#.preload(*include)
      end

      def computation_requests
        @computation_requests ||= filter.(filter_params, scope)
      end

      def scope
        computation_request_query.(current_user.id)
      end

      def include
        [
          :attachment,
          :'computation_form.computation_module',
          :author
        ]
      end
    end
  end
end
