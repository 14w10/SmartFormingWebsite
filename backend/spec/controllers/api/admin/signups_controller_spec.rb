# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::SignupsController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'signups'
    end
  end

  describe 'GET #show' do
    let!(:signup) { create(:signup) }

    before { get :show, params: { id: signup.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'signup'
      expect(json['data']['id'].to_i).to eq(signup.id)
    end
  end

  describe 'PUT #update' do
    let!(:signup) { create(:signup) }

    let(:signup_params) do
      {
        status: 'approve'
      }
    end

    before { put :update, params: { id: signup.id, signup: signup_params } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'signup'
      expect(json['data']['attributes']['status']).to eq('approved')
    end
  end
end
