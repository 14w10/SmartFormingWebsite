# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::PortfolioRequestsController do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'portfolio_requests'
    end
  end

  describe 'GET #show' do
    let!(:portfolio_request) { create(:portfolio_request) }

    before { get :show, params: { id: portfolio_request.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'portfolio_request'
      expect(json['data']['id'].to_i).to eq(portfolio_request.id)
    end
  end
end
