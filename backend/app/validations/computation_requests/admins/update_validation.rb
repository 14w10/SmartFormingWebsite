# frozen_string_literal: true

module ComputationRequests
  module Admins
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        option :record

        def computation_request_exists?(id)
          ComputationRequest.find_by(id: id).present?
        end

        def status_allowed?(value)
          ComputationRequest.states.include?(value.underscore.to_sym)
        end

        def status_may?(value)
          record.send(:"may_#{value.underscore}?")
        end
      end

      required(:computation_request_id).filled(:int?, :computation_request_exists?)
      required(:status).filled(:str?, :status_allowed?, :status_may?)
      optional(:decline_reason).maybe(:str?, :present?)
      optional(:attachments_attributes).each do
        required(:file_type).filled
        required(:file).filled
      end

      validate(decline_reason: [:decline_reason, :status]) do |reason, status|
        if status == 'declined'
          reason.present?
        else
          reason.nil?
        end
      end

      validate(computation_request_result: [:attachment_attributes, :status]) do |atts, status|
        if status == 'finished'
          atts.any?
        else
          atts.nil?
        end
      end
    end
  end
end
