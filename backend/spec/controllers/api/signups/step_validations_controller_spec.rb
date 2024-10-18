# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Signups::StepValidationsController do
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

    it 'matches schema' do
      expect(response.status).to eq 201
    end
  end
end
