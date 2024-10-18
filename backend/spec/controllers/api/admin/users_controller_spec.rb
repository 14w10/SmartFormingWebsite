# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::UsersController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'users'
    end
  end
end
