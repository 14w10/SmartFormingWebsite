# frozen_string_literal: true

module ComputationModules
  module Admins
    UpdateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        option :record

        def title_uniq?(value)
          !ComputationModule.where.not(id: record&.id).where(title: value).exists?
        end

        def module_uid_uniq?(value)
          !ComputationModule.where.not(id: record.try(:id)).where(uid: value).exists?
        end

        def status_allowed?(value)
          ComputationModule.states.include?(value.underscore.to_sym)
        end

        def status_may?(value)
          record.send(:"may_#{value.underscore}?")
        end
      end

      optional(:title).maybe(:str?, :title_uniq?, :title_size?, :present?)
      optional(:uid).maybe(:str?, :module_uid_uniq?, :module_uid_size?, :present?)
      optional(:description).maybe(:str?, :present?)
      optional(:category_id).maybe(:int?, :present?)
      optional(:status).maybe(:str?, :status_allowed?, :status_may?)
      optional(:reject_reason).maybe(:str?, :present?)

      validate(reject_reason: [:reject_reason, :status]) do |reason, status|
        if status == 'rejected'
          reason.present?
        else
          reason.nil?
        end
      end

      validate(uid: [:uid, :status]) do |uid, status|
        if status == 'published'
          uid.present?
        else
          uid.nil?
        end
      end
    end
  end
end
