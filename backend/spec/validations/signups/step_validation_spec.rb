# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::StepValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        title: title,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        password: password,
        password_confirmation: password_confirmation
      }
    end
    let(:title) { 'mr' }
    let(:first_name) { 'first name' }
    let(:last_name) { 'last name' }
    let(:email) { Faker::Internet.email }
    let(:phone_number) { '123456789010' }
    let(:password) { '12345678' }
    let(:password_confirmation) { '12345678' }

    context 'invalid' do
      context 'title' do
        let(:title) { 'invalid' }

        it 'returns errors' do
          expect_validation_error_for(:title)
        end
      end

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

      context 'phone_number' do
        let(:phone_number) { nil }

        it 'returns errors' do
          expect_validation_error_for(:phone_number)
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
