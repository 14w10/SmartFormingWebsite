# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::FilterQuery do
  describe '#call' do
    let(:service) { described_class.new }
    let(:result)  { service.(filter_params) }
    let(:category) { create :category }

    before do
      create(:computation_module, category: category)
      create(:computation_module, :approved, on_main_page: true)
    end

    context 'category' do
      let(:filter_params) do
        {
          category_id: category.id
        }
      end

      it 'returns collection' do
        expect(result.sample.category).to eq(category)
      end
    end

    context 'status' do
      let(:filter_params) do
        {
          status: :new
        }
      end

      it 'returns collection' do
        expect(result.any?).to be
      end
    end

    context 'status' do
      let(:filter_params) do
        {
          status: :approved
        }
      end

      it 'returns collection' do
        expect(result.sample.status).to eq('approved')
      end
    end

    context 'category_id' do
      let(:filter_params) do
        {
          category_id: category.id
        }
      end

      it 'returns collection' do
        expect(result.sample.category).to eq(category)
      end
    end

    context 'on_main_page' do
      let(:filter_params) do
        {
          on_main_page: true
        }
      end

      it 'returns collection' do
        expect(result.sample.on_main_page).to be_truthy
      end
    end

    context 'module_type' do
      let(:filter_params) do
        {
          module_type: :'post-fe'
        }
      end

      it 'returns collection' do
        expect(result.sample.module_type).to eq('post-fe')
      end
    end
  end
end
