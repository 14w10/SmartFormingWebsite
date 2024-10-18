# frozen_string_literal: true

class StepsValidator < ApplicationService
  include AutoInject[
    json_validator: 'services.json_validator',
  ]

  def call(schemas, raw_steps)
    steps = raw_steps.map do |step|
      step.inject({}) do |hash, (key, value)|
        hash[key] = value.with_indifferent_access['value']
        hash
      end
    end

    steps_validations_results = []
    (0..(schemas.size - 1)).to_a.each do |index|
      json_validation = json_validator.new(schemas[index], steps[index])
      steps_validations_results[index] = json_validation.success?
    end
    steps_validations_results.all?
  end
end
