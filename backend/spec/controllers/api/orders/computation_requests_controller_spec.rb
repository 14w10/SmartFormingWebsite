# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Orders::ComputationRequestsController do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'computation_requests'
    end
  end

  describe 'GET #show' do
    let!(:computation_request) { create(:computation_request, author: user) }

    before { get :show, params: { id: computation_request.id }, format: :json }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_request'
      expect(json['data']['id'].to_i).to eq(computation_request.id)
    end
  end

  describe 'GET #show' do
    let!(:computation_request) { create(:computation_request, author: user) }

    before { get :show, params: { id: computation_request.id, format: :json } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_request'
      expect(json['data']['id'].to_i).to eq(computation_request.id)
    end
  end
end
