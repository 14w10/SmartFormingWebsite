# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::PortfolioModulesController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

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
      pp = build(:portfolio_module).attributes.deep_symbolize_keys
      pp.delete(:id)
      pp.merge(
        author_id: author.id,
        portfolio_computation_modules_attributes: portfolio_computation_modules_attributes
      )
    end

    let(:params) do
      {
        portfolio_module: portfolio_module_params
      }
    end

    before do
      post :create, params: params
    end

    it 'creates portfolio_module' do
      expect(PortfolioModule.find_by(title: portfolio_module_params[:title])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'portfolio_module'
    end
  end

  describe 'GET #show' do
    let!(:portfolio_module) { create(:portfolio_module) }

    before { get :show, params: { id: portfolio_module.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'portfolio_module'
      expect(json['data']['id'].to_i).to eq(portfolio_module.id)
    end
  end

  describe 'PUT #update' do
    let!(:portfolio_module) { create(:portfolio_module) }

    let(:portfolio_module_params) do
      {
        title: 'updated'
      }
    end

    before do
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
