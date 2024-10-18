# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::Forms::BuildersController do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

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

  describe 'POST #create' do
    let!(:computation_module) { create(:computation_module, :approved) }
    let(:params) do
      {
        form: {
          computation_module_id: computation_module.id,
          steps: steps,
          files: files
        }
      }
    end

    before { post :create, params: params }

    it 'creates computation_module' do
      expect(computation_module.computation_form.persisted?).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']).to match_schema 'form'
    end
  end

  describe 'GET #show' do
    let!(:computation_form) do
      create(:computation_form, meta: { steps: steps, files: files })
    end
    let(:author) { computation_form.computation_module.author }

    before { get :show, params: { id: computation_form.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'form'
    end
  end

  describe 'PUT #update' do
    let!(:computation_form) { create(:computation_form) }
    let(:author) { computation_form.computation_module.author }
    let(:form) do
      {
        computation_module_id: computation_form.computation_module.id,
        steps: steps,
        files: files
      }
    end

    before { put :update, params: { id: computation_form.id, form: form } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'form'
    end
  end
end
