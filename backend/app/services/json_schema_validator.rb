# frozen_string_literal: true
require 'json_schemer'

class JsonSchemaValidator < ApplicationService
  def initialize(raw_schema, json, validator = JSONSchemer)
    @json = json.reject { |_key, value| value.blank? }.deep_stringify_keys
    schema = prepare(raw_schema.with_indifferent_access)
    @validator = validator.schema(schema)
  end

  def success?
    @validator.valid?(@json)
  end

  def errors
    @validator.validate(@json).to_a


    # hash = {}
    # messages = @validator.validate(@json).to_a.map do |message|
    #   message[13..(message.size - 48)].split(/[']/i)
    # end

    # messages.each do |message|
    #   key, detail = format(message)
    #   hash[key] = detail
    # end
    # hash
  end

  private

  def prepare(raw_schema)
    raw_schema.deep_stringify_keys
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
