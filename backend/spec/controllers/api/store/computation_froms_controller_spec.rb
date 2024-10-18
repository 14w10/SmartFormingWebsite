# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::ComputationFormsController do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #show' do
    let!(:computation_form) { create(:computation_form, meta: meta) }

    let(:meta) do
      {
        steps: [
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
        ],
        files: [
          {
            label: 'label',
            description: 'description',
            field_name: 'fieldName'
          }
        ]
      }
    end

    before { get :show, params: { id: computation_form.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'form'
    end
  end
end
