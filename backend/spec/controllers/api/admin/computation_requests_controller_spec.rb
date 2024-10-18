# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::ComputationRequestsController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'computation_requests'
    end
  end

  describe 'GET #show' do
    let!(:computation_request) { create(:computation_request) }

    before { get :show, params: { id: computation_request.id }, format: :json }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_request'
      expect(json['data']['id'].to_i).to eq(computation_request.id)
    end
  end

  describe 'GET #show.file' do
    let!(:computation_request) { create(:computation_request) }

    before { get :show, params: { id: computation_request.id, type: 'file' }, format: :json }

    it 'matches schema' do
      expect(response.status).to eq 200
    end
  end

  describe 'PUT #update' do
    let!(:computation_request) { create(:computation_request) }

    let(:computation_request_params) do
      {
        status: :processing,
        graph_type: :test
      }
    end

    before do
      put :update, params: {
        id: computation_request.id, computation_request: computation_request_params
      }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_request'
      expect(json['data']['attributes']['status']).to eq('processing')
      expect(json['data']['attributes']['graphType']).to eq('test')
    end
  end
end
