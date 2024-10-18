# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::ComputationModulesController, type: :controller do
  let(:user) { create(:user) }
  let(:category) { create :category }

  before { sign_in user }

  describe 'GET #index' do
    let(:author) { create(:user) }

    before do
      stub_current(author)
      get :index
    end

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
            storage: 'cache'
          }
        }
      ]
    end

    let(:datasets_attributes) do
      [
        {
          price: 0.01,
          file_type: 'dataset',
          paid: false,
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache'
          }
        }
      ]
    end
    let(:computation_module_params) do
      build(:computation_module).attributes.merge(
        author_id: author.id,
        category_id: category.id,
        module_content_type: :data_module,
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

    it 'creates datasets' do
      expect(ComputationModule.find_by(computation_module_params[:title]).datasets.size).to eq(1)
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'computation_module'
    end
  end

  describe 'GET #show' do
    let!(:computation_module) { create(:computation_module) }
    let(:author) { computation_module.author }

    before do
      stub_current(author)
      get :show, params: { id: computation_module.id }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_module'
      expect(json['data']['id'].to_i).to eq(computation_module.id)
    end
  end

  describe 'PUT #update' do
    let!(:computation_module) { create(:computation_module) }
    let(:author) { computation_module.author }

    let(:attachments_attributes) do
      [
        {
          file_type: 'functionalModule',
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache'
          }
        },
        {
          file_type: 'verificationReport',
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache'
          }
        }
      ]
    end
    
    before do
      stub_current(author)
    end

    it 'matches schema' do
      put :update, params: {
        id: computation_module.id, computation_module: { title: 'updated' }
      }
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_module'
      expect(json['data']['attributes']['title']).to eq('updated')
    end

    it 'matches schema' do
      put :update, params: {
        id: computation_module.id, computation_module: { title: computation_module.title }
      }
      expect(response.status).to eq 200
    end

    it 'updates the attachment' do
      put :update, params: {
        id: computation_module.id, computation_module: { attachments_attributes: attachments_attributes }
      }

      expect(response.status).to eq 200
    end
  end
end
