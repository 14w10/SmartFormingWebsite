# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::PortfolioRequestsController do
  let(:user) { create(:user) }

  before { sign_in user }
  describe 'POST #create' do
    let(:author) { user }
    let(:portfolio_module) { create(:portfolio_module, :published, author: author) }
    let(:validation) { double('validation', success?: true) }
    let(:portfolio_computation_request) { create :portfolio_computation_request }
    let(:portfolio_request_params) do
      {
        portfolio_module_id: portfolio_module.id,
        author_id: author.id,
        portfolio_computation_request_ids: [portfolio_computation_request.id]
      }
    end
    let(:params) do
      {
        portfolio_request: portfolio_request_params,
        portfolio_module_id: portfolio_module.id

      }
    end

    before do
      post :create, params: params
    end

    it 'creates portfolio_request' do
      expect(author.portfolio_requests.any?).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'portfolio_request'
    end
  end
end
