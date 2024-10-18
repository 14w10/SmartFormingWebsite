# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationForms::UpdateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:computation_module) { create(:computation_module, :approved) }
    let(:params) do
      {
        computation_module_id: computation_module.id,
        steps: steps,
        files: files
      }
    end

    let(:steps) do
      [
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
      ]
    end
    let(:files) do
      [
        {
          'label': 'label',
          'description': 'description',
          'field_name': 'fieldName'
        }
      ]
    end

    context 'invalid' do
      context 'steps' do
        let(:steps) { nil }

        it 'returns errors' do
          expect_validation_error_for(:steps)
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
