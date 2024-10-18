# frozen_string_literal: true

module Concerns
  module DryErrors
    def with_dry(errors, mappings: {})
      mapping_errors_for(mappings, errors)
      self_errors_for(errors)

      self
    end

    private

    def mapping_errors_for(mappings, errors)
      if mappings.any?
        mapping_errors = errors.extract!(*mappings.keys)
        if mapping_errors.any?
          mapping_errors.each do |error, message|
            field = mappings[error]
            self.errors.add(field, message.join(', ')) unless self.errors.key?(field)
          end
        end
      end
    end

    def self_errors_for(errors)
      errors.each do |field, message|
        self.errors.add(field, message.join(', '))
      end
    end
  end
end
