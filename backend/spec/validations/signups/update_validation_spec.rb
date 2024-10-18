# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::UpdateValidation do
  describe '#call' do
    let!(:signup)        { create(:signup) }

    let(:status)         { 'approve' }
    let(:decline_reason) { nil }
    let(:params) do
      {
        decline_reason: decline_reason,
        status: status
      }
    end
    let(:validation) { described_class.(params) }

    context 'invalid' do
      let(:status) { 'not_valid' }

      context 'status_allowed?' do
        it 'returns errors' do
          expect_validation_error_for(:status)
        end
      end

      context 'decline_reason' do
        let(:status)         { 'decline' }
        let(:decline_reason) { '' }

        it 'returns errors' do
          expect_validation_error_for(:decline_reason)
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
