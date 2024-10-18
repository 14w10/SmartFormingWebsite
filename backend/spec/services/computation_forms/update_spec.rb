# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationForms::Update do
  describe '#call' do
    let(:computation_form) { create(:computation_form) }
    let(:service) { described_class.new }
    let(:result) { service.(computation_form, {}, steps, files) }
    let(:steps) do
      [
        {
          '$id': 12_313,
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
          label: 'label',
          description: 'description',
          field_name: 'fieldName'
        }
      ]
    end

    it 'creates computation_form' do
      expect(result).to be_kind_of(ComputationForm)
      expect(result.meta['steps'].count).to eq(1)
      expect(result.persisted?).to be
    end
  end
end
