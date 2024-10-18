# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Forms::ValidationsController do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'POST #create' do
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
        ]
      }
    end
    let(:params) do
      {
        step_id: 0,
        computation_form_id: computation_form.id,
        data: {
          last_name: 'last_name',
          first_name: 'first_name',
          age: 18
        }
      }
    end
    let(:json_validation) { double('JsonValidator', success?: true) }

    before do
      allow(controller).to receive(:json_validation).and_return(json_validation)
      get :create, params: { validation: params }
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']).to match_schema 'form'
    end
  end
end
