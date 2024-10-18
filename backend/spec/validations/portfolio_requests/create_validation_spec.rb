# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortfolioRequests::CreateValidation do
  describe '#call' do
    let!(:portfolio_module) { create(:portfolio_module, :published) }
    let!(:author) { portfolio_module.author }
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        author_id: author.id,
        portfolio_module_id: portfolio_module.id
      }
    end

    context 'invalid' do
      context 'author_id' do
        let(:author) { double('author', id: 0) }

        it 'returns errors' do
          expect_validation_error_for(:author_id)
        end
      end

      context 'computation_form_id' do
        let(:portfolio_module) do
          double('portfolio_module', id: 0, author: double('author', id: 1))
        end

        it 'returns errors' do
          expect_validation_error_for(:portfolio_module_id)
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
