# frozen_string_literal: true

module Signups
  UpdateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def status_allowed?(value)
        ['approve', 'decline'].include?(value)
      end

      def user_exists?(value)
        !User.find_by(email: value)
      end
    end

    required(:status).filled(:str?, :status_allowed?, :user_exists?)
    optional(:decline_reason).maybe(:str?, :present?)

    validate(decline_reason: [:decline_reason, :status]) do |reason, status|
      if status == 'decline'
        reason.present?
      else
        reason.nil?
      end
    end
  end
end
