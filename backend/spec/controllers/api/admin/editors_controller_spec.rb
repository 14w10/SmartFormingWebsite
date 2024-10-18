# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::EditorsController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'editors'
    end
  end

  describe 'POST #create' do
    let(:editor_params) { build(:user, :editor).attributes }
    let(:params) do
      {
        editor: editor_params.merge!(
          'password' => '12345678',
          'password_confirmation' => '12345678'
        )
      }
    end

    before { post :create, params: params }

    it 'creates admin' do
      expect(User.find_by(editor_params[:email])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'editor'
    end
  end
end
