# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::ComputationModulesController, type: :controller do
  let(:admin) { create(:user, :admin) }
  let(:category) { create :category }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'computation_module'
    end
  end

  describe 'POST #create' do
    let(:author) { create(:user) }
    let(:attachments_attributes) do
      [
        {
          file_type: 'verificationReport',
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache',
            metadata: {
              size: 874,
              filename: '0.pdf',
              mime_type: 'application/pdf'
            }
          }
        }
      ]
    end
    let(:datasets_attributes) do
      [
        {
          file_type: 'datasetReport',
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache',
            metadata: {
              size: 874,
              filename: '0.pdf',
              mime_type: 'application/pdf'
            }
          }
        }
      ]
    end
    let(:computation_module_params) do
      build(:computation_module).attributes.merge(
        author_id: author.id,
        category_id: category.id,
        attachments_attributes: attachments_attributes,
        datasets_attributes: datasets_attributes
      )
    end

    let(:params) do
      {
        computation_module: computation_module_params
      }
    end

    before { post :create, params: params }

    it 'creates computation_module' do
      expect(ComputationModule.find_by(computation_module_params[:title])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'computation_module'
    end
  end

  describe 'GET #show' do
    let!(:computation_module) { create(:computation_module) }
    let!(:dataset) { create(:dataset, computation_module: computation_module) }

    before { get :show, params: { id: computation_module.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_module'
      expect(json['data']['id'].to_i).to eq(computation_module.id)
    end
  end

  describe 'PUT #update' do
    let!(:computation_module) { create(:computation_module) }

    let(:computation_module_params) do
      {
        title: 'updated'
      }
    end

    it 'matches schema' do
      put :update, params: {
        id: computation_module.id, computation_module: { title: 'updated' }
      }
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_module'
      expect(json['data']['attributes']['title']).to eq('updated')
    end

    it 'title is unique' do
      put :update, params: {
        id: computation_module.id, computation_module: { title: computation_module.title, description: 'te' }
      }

      expect(response.status).to eq 200
    end
  end

  describe 'PUT #destroy' do
    let!(:computation_module) { create(:computation_module) }

    before { delete :destroy, params: { id: computation_module.id } }

    it 'matches schema' do
      expect(response.status).to eq 204
    end
  end
end
