# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::ComputationModulesController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #index' do
    let!(:computation_module) { create :computation_module, :published }

    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'computation_module'
    end
  end

  describe 'GET #show' do
    let!(:computation_module) { create(:computation_module, :published) }

    before { get :show, params: { id: computation_module.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_module'
      expect(json['data']['id'].to_i).to eq(computation_module.id)
    end
  end
end
