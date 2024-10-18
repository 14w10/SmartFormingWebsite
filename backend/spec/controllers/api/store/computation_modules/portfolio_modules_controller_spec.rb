# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::ComputationModules::PortfolioModulesController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #index' do
    context 'with unpublished computation module' do
      let(:computation_module) { create :computation_module, :under_review }

      before { get :index, params: { id: computation_module.id } }

      it 'return 404 htt status' do
        expect(response).to have_http_status :not_found
      end
    end

    context 'with published computation module' do
      let(:computation_module) { create :computation_module, :published }

      before { get :index, params: { id: computation_module.id } }

      it 'matches schema' do
        expect(response.status).to eq 200
        expect(json['data']).to match_schema 'portfolio_modules'
      end
    end
  end
end
