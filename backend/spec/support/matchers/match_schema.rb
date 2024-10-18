# frozen_string_literal: true

require 'json-schema'

RSpec::Matchers.define :match_schema do |schema|
  match do |json|
    schema_path = Rails.root.join("spec/json_schemes/#{schema}.json")
    @errors = JSON::Validator.fully_validate(schema_path.to_s, json, validate_schema: true)
    @errors.none?
  rescue JSON::Schema::ValidationError => e
    @errors = [schema_path.to_s + "\n" + e.message]
    false
  end

  failure_message do
    @errors.first
  end
end
