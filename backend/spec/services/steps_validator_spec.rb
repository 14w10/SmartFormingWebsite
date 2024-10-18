# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StepsValidator do
  describe '#call' do
    let(:steps) do
      [
        {
          'a1572354069735': {
            'label': 'Text field ',
            'value': 'Test'
          }
        }
      ]
    end

    let(:schemas) do
      [
        {
          '$id': 'ljOMfEkOJ5iKsO7bqr6W4',
          type: 'object',
          title: 'Step',
          '$schema': 'http://json-schema.org/draft-07/schema#',
          required: ['a1572354069735'],
          properties: {
            'a1572354069735': {
              type: 'string',
              default: '',
              min_length: 1,
              description: 'Text field'
            }
          },
          description: 'form description'
        }
      ]
    end

    let(:result) { service.(schemas, steps) }
    let(:service) { described_class.new }
    let(:json_validator) { double('json_validator', success?: true) }

    it 'validates steps' do
      expect(result).to be
    end
  end
end
