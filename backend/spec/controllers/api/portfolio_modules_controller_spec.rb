# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::PortfolioModulesController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #index' do
    let(:author) { create(:user) }

    before do
      stub_current(author)
      get :index
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'portfolio_module'
    end
  end

  describe 'POST #create' do
    let(:author) { create(:user) }
    let(:portfolio_computation_modules_attributes) do
      [
        {
          computation_module_id: create(:computation_module).id.to_i
        }
      ]
    end
    let(:portfolio_module_params) do
      build(:portfolio_module).attributes.merge(
        author_id: author.id,
        portfolio_computation_modules_attributes: portfolio_computation_modules_attributes
      )
    end
    let(:params) do
      {
        portfolio_module: portfolio_module_params
      }
    end

    before { post :create, params: params }

    it 'creates portfolio_module' do
      expect(PortfolioModule.find_by(portfolio_module_params[:title])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'portfolio_module'
    end
  end

  describe 'GET #show' do
    let!(:portfolio_module) { create(:portfolio_module) }
    let(:author) { portfolio_module.author }

    before do
      stub_current(author)
      get :show, params: { id: portfolio_module.id }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'portfolio_module'
      expect(json['data']['id'].to_i).to eq(portfolio_module.id)
    end
  end

  describe 'PUT #update' do
    let!(:portfolio_module) { create(:portfolio_module) }
    let(:author) { portfolio_module.author }

    let(:portfolio_module_params) do
      {
        title: 'updated'
      }
    end

    before do
      stub_current(author)
      put :update, params: {
        id: portfolio_module.id, portfolio_module: portfolio_module_params
      }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'portfolio_module'
      expect(json['data']['attributes']['title']).to eq('updated')
    end
  end
end
