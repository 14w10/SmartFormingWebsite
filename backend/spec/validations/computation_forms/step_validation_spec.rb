# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationForms::StepValidation do
  describe '#call' do
    let!(:computation_form) { create(:computation_form, meta: { steps: [step] }) }
    let(:step) do
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
    let(:step_id) { 0 }
    let(:params) do
      {
        step_id: step_id,
        computation_form_id: computation_form.id,
        step: step
      }
    end
    let(:validation) { described_class.(params) }

    context 'invalid' do
      context 'steps' do
        let(:step_id) { nil }

        it 'returns errors' do
          expect_validation_error_for(:step_id)
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
