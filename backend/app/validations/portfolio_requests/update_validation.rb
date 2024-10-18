# frozen_string_literal: true

module PortfolioRequests
  UpdateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      option :record

      def status_allowed?(value)
        PortfolioRequest.states.include?(value.underscore.to_sym)
      end

      def status_may?(value)
        record.send(:"may_#{value.underscore}?")
      end
    end

    required(:status).filled(:str?, :status_allowed?, :status_may?)
    optional(:decline_reason).maybe(:str?, :present?)

    validate(decline_reason: [:decline_reason, :status]) do |reason, status|
      if status == 'declined'
        reason.present?
      else
        reason.nil?
      end
    end
  end
end
