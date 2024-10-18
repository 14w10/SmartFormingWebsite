# frozen_string_literal: true

module Concerns
  module ErrorsHandler
    extend ActiveSupport::Concern

    included do
      rescue_from ::AASM::InvalidTransition, with: :handle_invalid_record_error
      rescue_from ::ActionController::RoutingError, with: :handle_route_not_found
      rescue_from ::ActionController::InvalidAuthenticityToken, with: :handle_unverified_request
      rescue_from ::ActiveRecord::RecordNotFound, with: :handle_not_found
      rescue_from ::ActiveRecord::RecordInvalid, with: :handle_invalid_record_error
      rescue_from ::ApplicationController::ForbiddenError, with: :handle_forbidden
      rescue_from ::ApplicationController::UnauthorizedError, with: :handle_unauthorized
      rescue_from ::ArgumentError, with: :handle_invalid_record_error
    end

    protected

    def handle_route_not_found
      raise NotImplementedError
    end

    def handle_not_found
      raise NotImplementedError
    end

    def handle_invalid_record_error
      raise NotImplementedError
    end

    def handle_unauthorized
      raise NotImplementedError
    end

    def handle_forbidden
      raise NotImplementedError
    end

    def handle_unverified_request
      raise NotImplementedError
    end

    def render_json_errors(errors, status)
      puts errors.inspect
      render(
        json: {
          errors: errors.map do |key, messages|
            {
              source: { pointer: "/data/attributes/#{key.to_s.camelcase(:lower)}" },
              detail: messages.respond_to?(:join) ? messages.join(', ') : messages
            }
          end
        },
        status: status,
        content_type: 'application/json'
      )
    end

    def render_json_error(message, status)
      render(
        json: {
          errors: [{ source: { pointer: '/data' }, detail: message }]
        },
        status: status,
        content_type: 'application/json'
      )
    end
  end
end
