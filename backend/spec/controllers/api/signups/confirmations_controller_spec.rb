# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Signups::ConfirmationsController do
  describe 'POST #create' do
    let(:signup) { create(:signup) }

    context 'with existing token' do
      let(:params) do
        {
          signup: {
            token: signup.confirmation_token
          }
        }
      end

      before { post :create, params: params }

      it 'responses success' do
        expect(response.status).to eq 200
      end
  
      it 'changes status to approved' do
        expect(signup.reload.approved?).to be_truthy
      end

      it 'changes confirmation token to nil' do
        expect(signup.reload.confirmation_token).to be_nil
      end
    end

    context 'with non-existing token' do
      let(:params) do
        {
          signup: {
            token: 'abc'
          }
        }
      end

      before { post :create, params: params }

      it 'responses error' do
        expect(response.status).to eq 422
      end
    end
  end
end
