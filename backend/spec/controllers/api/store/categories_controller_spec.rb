# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::CategoriesController, type: :controller do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'categories'
    end
  end

  describe 'GET #show' do
    let!(:category) { create(:category) }

    context 'when success' do
      before { get :show, params: { id: category.id } }

      it 'matches schema' do
        expect(response.status).to eq 200
        expect(json['data']['attributes']).to match_schema 'category'
        expect(json['data']['id'].to_i).to eq(category.id)
      end
    end

    context 'when category not found' do
      before { get :show, params: { id: 0 } }

      it 'returns error message and status' do
        expect(response.status).to eq 404
        expect(json).to eq(
          'errors' => [{ 'source' => { 'pointer' => '/data' }, 'detail' => 'Not found' }]
        )
      end
    end
  end
end
