# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::AdminsController, type: :controller do
  context 'admin' do
    let(:admin) { create(:user, :admin) }

    before { sign_in admin }

    describe 'GET #index' do
      before { get :index }

      it 'matches schema' do
        expect(response.status).to eq 200
        expect(json['data'].map { |data| data['attributes'] }).to match_schema 'admins'
      end
    end

    describe 'POST #create' do
      let(:admin_params) { build(:user, :admin).attributes }
      let(:params) do
        {
          admin: admin_params.merge!(
            'password' => 12_345_678,
            'password_confirmation' => 12_345_678
          )
        }
      end

      before { post :create, params: params }

      it 'creates admin' do
        expect(User.find_by(admin_params[:email])).to be
      end

      it 'matches schema' do
        expect(response.status).to eq 201
        expect(json['data']['attributes']).to match_schema 'admin'
      end
    end
  end

  context 'editor' do
    let(:editor) { create(:user, :editor) }

    before { sign_in editor }

    describe 'GET #index' do
      before { get :index }

      it 'matches schema' do
        expect(response.status).to eq 200
      end
    end

    describe 'POST #create' do
      before { post :create }

      it 'raise error' do
        expect(response.status).to eq 403
      end
    end
  end
end
