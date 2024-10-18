# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::ComputationResultsController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #show' do
    let!(:computation_result) { create(:computation_result) }

    before { get :show, params: { id: computation_result.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_result'
      expect(json['data']['id'].to_i).to eq(computation_result.id)
    end
  end

  describe 'PUT #update' do
    let!(:computation_result) { create(:computation_result) }

    let(:computation_result_params) do
      {
        "parameters": [
          {
            "x": "datax",
            "y": "datay",
            "z": "dataz",
            "type": "scatter",
            "color": {
              "hex": "#D0021B"
            }
          }
        ]
      }
    end

    before do
      put :update, params: {
        id: computation_result.id, computation_result: computation_result_params
      }
    end

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_result'
      parameters = json['data']['attributes']['parameters'].first
      expect(parameters['x']).to eq('datax')
      expect(parameters['y']).to eq('datay')
      expect(parameters['z']).to eq('dataz')
    end
  end
end
