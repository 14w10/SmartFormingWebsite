# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Admin::CategoriesController, type: :controller do
  let(:admin) { create(:user, :admin) }

  before { sign_in admin }

  describe 'GET #index' do
    before { get :index }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']).to match_schema 'categories'
    end
  end

  describe 'POST #create' do
    let(:params) do
      {
        category: {
          name: 'metals'
        }
      }
    end

    before { post :create, params: params }

    it 'creates category' do
      expect(Category.find_by(params[:name])).to be
    end

    it 'matches schema' do
      expect(response.status).to eq 201
      expect(json['data']['attributes']).to match_schema 'category'
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
        expect(json).to eq('errors' => [{ 'source' => { 'pointer' => '/data' }, 'detail' => 'Not found' }])
      end
    end
  end

  describe 'PUT #update' do
    let!(:category) { create(:category) }
    let!(:computation_module) { create :computation_module, on_main_page: false, category: category }

    it 'matches schema' do
      put :update, params: {
        id: category.id,
        category: {
          name: 'updated',
          computation_modules_attributes: [
            {
              id: computation_module.id,
              on_main_page: true
            }

          ]
        }

      }

      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'category'
      expect(json['data']['attributes']['name']).to eq('updated')
      expect(computation_module.reload.on_main_page).to be_truthy
    end

    it 'name is unique' do
      put :update, params: {
        id: category.id,
        category: { name: category.name }

      }

      expect(response.status).to eq 200
    end
  end

  describe 'DELETE #destroy' do
    let!(:category) { create(:category) }

    context 'with success' do
      before { delete :destroy, params: { id: category.id } }

      it 'matches schema' do
        expect(response).to have_http_status :no_content
      end
    end

    context 'when category has at least 1 computation module' do
      let!(:computation_module) { create :computation_module, category: category }

      before { delete :destroy, params: { id: category.id } }

      it 'matches schema' do
        expect(response).to have_http_status :unprocessable_entity
        expect(json).to eq(
          'errors' => [
            {
              'source' => { 'pointer' => '/data' },
              'detail' => 'Category with assigned modules cannot be removed'

            }
          ]
        )
      end
    end

    context 'when category not found' do
      before { delete :destroy, params: { id: 0 } }

      it 'returns error message and status' do
        expect(response).to have_http_status :not_found

        expect(json).to eq('errors' => [{ 'source' => { 'pointer' => '/data' }, 'detail' => 'Not found' }])
      end
    end
  end
end
