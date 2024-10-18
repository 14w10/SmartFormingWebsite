# frozen_string_literal: true

module PortfolioModules
  module Admins
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        option :record

        def title_uniq?(value)
          !PortfolioModule.where(title: value).exists?
        end

        def status_allowed?(value)
          PortfolioModule.states.include?(value.underscore.to_sym)
        end

        def status_may?(value)
          record.send(:"may_#{value.underscore}?")
        end
        
        def computation_module_exists?(id)
          !ComputationModule.exists?(id)
        end        
      end
      
      optional(:portfolio_computation_modules_attributes).each do
        optional(:computation_module_id).maybe(
          :int?,
          :computation_module_exists?
        )
      end

      optional(:title).maybe(:str?, :title_uniq?, :title_size?, :present?)
      optional(:description).maybe(:str?, :present?)
      optional(:status).maybe(:str?, :status_allowed?, :status_may?)
      optional(:reject_reason).maybe(:str?, :present?)

      validate(reject_reason: [:reject_reason, :status]) do |reason, status|
        if status == 'rejected'
          reason.present?
        else
          reason.nil?
        end
      end
    end
  end
end
