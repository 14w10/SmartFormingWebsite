# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Editors::CreateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        first_name: first_name,
        last_name: last_name,
        email: email
      }
    end
    let(:first_name) { 'first name' }
    let(:last_name) { 'last name' }
    let(:email) { Faker::Internet.email }

    context 'invalid' do
      context 'first_name' do
        let(:first_name) { 0 }

        it 'returns errors' do
          expect_validation_error_for(:first_name)
        end
      end

      context 'last_name' do
        let(:last_name) { 0 }

        it 'returns errors' do
          expect_validation_error_for(:last_name)
        end
      end

      context 'email' do
        let(:email) { 'invalid' }

        it 'returns errors' do
          expect_validation_error_for(:email)
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
