# frozen_string_literal: true

module ComputationRequests
  module Admins
    class Update
      # rubocop:disable Metrics/MethodLength
      def call(computation_request, params)
        status = params.delete(:status).try(:underscore)

        ActiveRecord::Base.transaction do
          case status
          when 'processing'
            computation_request.processing!
            computation_request.touch(:processed_at)
          when 'finished'
            computation_request.finished!
            computation_request.touch(:finished_at)
            prepare_attachment(params) if params[:attachment_attributes].present?
          when 'declined'
            computation_request.declined!
            computation_request.touch(:declined_at)
          end

          computation_request.update(params)
          computation_request
        end
      end
      # rubocop:enable Metrics/MethodLength

      private

      def prepare_attachment(params)
        attachment_attributes = params.delete(:attachment_attributes)
        attachment_attributes.merge!(file: attachment_attributes[:file].to_json)
        
        params.merge!(attachment_attributes: attachment_attributes)
      end
    end
  end
end
