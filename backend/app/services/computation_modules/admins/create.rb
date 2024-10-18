# frozen_string_literal: true

module ComputationModules
  module Admins
    class Create
      def call(params)
        attachments_attributes = params.delete(:attachments_attributes).map do |atts|
          atts.merge(file: atts[:file].to_json)
        end
        computation_module = ComputationModule.create!(
          params.merge(attachments_attributes: attachments_attributes)
        )
        computation_module.pre_approved
        computation_module.touch(:approved_at)
        computation_module.save
        computation_module
      end
    end
  end
end
