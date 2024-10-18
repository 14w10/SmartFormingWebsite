# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::SignupsController, type: :controller do
  describe 'POST #create' do
    let(:signup_params) { build(:signup).attributes }
    let(:params) do
      {
        signup: signup_params.merge!(
          'password' => '12345678',
          'password_confirmation' => '12345678'
        )
      }
    end

    before { post :create, params: params }

    it 'creates signup' do
      expect(Signup.find_by(signup_params[:email])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'signup'
    end
  end
end
