# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortfolioModules::Admins::CreateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        title: title,
        description: description,
        author_id: author.id,
        portfolio_computation_modules_attributes:[
          { computation_module_id: create(:computation_module).id }
        ]
      }
    end
    let(:title) { 'title' }
    let(:description) { 'description' }
    let(:author) { create(:user) }
    let(:computation_module) { create(:computation_module) }

    context 'invalid' do
      context 'title' do
        let(:title) { 'title' * 100 }

        it 'returns errors' do
          expect_validation_error_for(:title)
        end
      end

      context 'description' do
        let(:description) { nil }

        it 'returns errors' do
          expect_validation_error_for(:description)
        end
      end

      context 'author_id' do
        let(:author) { double('author', id: 0) }

        it 'returns errors' do
          expect_validation_error_for(:author_id)
        end
      end
    end

    context 'valid' do
      it 'returns success' do
        expect(validation.success?).to be
      end
    end
  end
end
