# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JsonValidator do
  describe '#call' do
    let(:schema) do
      {
        '$id': '12313',
        '$schema': 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        title: 'Step 1',
        description: 'form description',
        required: [
          'firstName',
          'lastName',
          'age'
        ],
        properties: {
          firstName: {
            default: 'Vasia',
            description: 'First name.',
            minLength: 1,
            type: 'string'
          },
          lastName: {
            description: 'Last name.',
            minLength: 1,
            type: 'string'
          },
          age: {
            description: 'Age.',
            minimum: 18,
            type: 'integer'
          }
        }
      }
    end
    let(:json) do
      {
        'last_name': 'name',
        'first_name': 'first name',
        'age': age
      }
    end
    let(:age) { 18 }
    let(:validation) { described_class.new(schema, json) }

    context 'invalid' do
      context 'last_name' do
        let(:age) { '18' }

        it 'returns errors' do
          expect(validation.errors).to be
        end
      end
    end

    context 'valid' do
      it 'returns success' do
        expect(validation.success?).to be
      end
    end
  end
end
