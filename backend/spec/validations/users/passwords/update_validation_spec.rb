# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Passwords::UpdateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        password: password,
        password_confirmation: password_confirmation
      }
    end
    let(:password) { '12345678' }
    let(:password_confirmation) { '12345678' }

    context 'invalid' do
      context 'password_confirmation' do
        let(:password_confirmation) { '123456789' }

        it 'returns errors' do
          expect_validation_error_for(:password_confirmation)
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
