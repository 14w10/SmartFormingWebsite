# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::PortfolioRequestsController, type: :controller do
  let(:user) { create(:user) }
  let(:portfolio_module) { create(:portfolio_module, author: user) }

  before { sign_in user }

  describe 'GET #index' do
    let(:author) { create(:user) }

    before do
      stub_current(author)
      get :index, params: { portfolio_module_id: portfolio_module.id }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'portfolio_request'
    end
  end
end
