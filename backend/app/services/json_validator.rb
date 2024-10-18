# frozen_string_literal: true

class JsonValidator < ApplicationService
  def initialize(raw_schema, json, validator = JSON::Validator)
    @validator = validator
    @json = json.reject { |_key, value| value.blank? }
    @schema = prepare(raw_schema.with_indifferent_access)
  end

  def success?
    @validator.validate(@schema, @json)
  end

  def errors
    hash = {}
    messages = @validator.fully_validate(@schema, @json).map do |message|
      message[13..(message.size - 48)].split(/[']/i)
    end

    messages.each do |message|
      key, detail = format(message)
      hash[key] = detail
    end
    hash
  end

  private

  def prepare(raw_schema)
    required = raw_schema['required']
    raw_schema.delete('$schema')
    raw_schema.merge('required' => required.map(&:underscore))
  end

  def format(message)
    case message.size
    when 3
      # ["", "#/age", " did not have a minimum value of 18, inclusively"]
      _empty, key, details = message
      key = key[2..-1]
    when 4
      # ["", "#/", " did not contain a required property of ", "first_name"]
      _empty, _prefix, details, key = message
      details = details[0..-5]
    end

    [key, details[1..-1].capitalize]
  end
end
