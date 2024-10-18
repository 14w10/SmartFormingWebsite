# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::UpdateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        title: title,
        description: description
      }
    end
    let(:title) { 'title' }
    let(:description) { 'description' }

    context 'invalid' do
      context 'title' do
        let(:title) { 'title' * 100 }

        it 'returns errors' do
          expect_validation_error_for(:title)
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
