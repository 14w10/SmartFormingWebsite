# frozen_string_literal: true

module ComputationResults
  module Admins
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        # def typ_allowed?(value)
        #   ComputationResult.typs.include?(value.underscore.to_sym)
        # end
      end

      optional(:x).maybe(:str?, :present?)
      optional(:y).maybe(:str?, :present?)
      optional(:z).maybe(:str?, :present?)
      optional(:typ).maybe(:str?, :present?) # :typ_allowed?
    end
  end
end
