# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::CreateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        title: title,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        position: position,
        role: role,
        password: password,
        password_confirmation: password_confirmation,
        organization_name: organization_name,
        organization_address: organization_address,
        organization_postcode: organization_postcode,
        organization_country: organization_country,
        organization_business: organization_business,
        website: nil,
        linkedin: nil,
        research_gate: nil,
        other_link: nil
      }
    end
    let(:title) { 'mr' }
    let(:first_name) { 'first name' }
    let(:last_name) { 'last name' }
    let(:email) { Faker::Internet.email }
    let(:phone_number) { '123456789010' }
    let(:position) { 'position' }
    let(:role) { 'role' }
    let(:password) { '12345678' }
    let(:password_confirmation) { '12345678' }
    let(:organization_name) { 'organization_name' }
    let(:organization_address) { 'organization_address' }
    let(:organization_postcode) { 'organization_postcode' }
    let(:organization_country) { 'organization_country' }
    let(:organization_business) { 'industrial' }

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

      context 'organization_business' do
        let(:organization_business) { 'invalid' }

        it 'returns errors' do
          expect_validation_error_for(:organization_business)
        end
      end
    end

    context 'valid' do
      it 'returns success' do
        expect(validation.success?).to be
      end

      context 'without organization_business' do
        let(:organization_business) { nil }

        it 'returns success' do
          expect(validation.success?).to be
        end

        describe 'empty string' do
          let(:organization_business) { '' }

          it 'returns success' do
            expect(validation.success?).to be
          end
        end
      end

      context 'without role' do
        let(:role) { nil }

        it 'returns success' do
          expect(validation.success?).to be
        end

        describe 'empty string' do
          let(:role) { '' }

          it 'returns success' do
            expect(validation.success?).to be
          end
        end
      end

      context 'without position' do
        let(:position) { nil }

        it 'returns success' do
          expect(validation.success?).to be
        end

        describe 'empty string' do
          let(:position) { '' }

          it 'returns success' do
            expect(validation.success?).to be
          end
        end
      end
    end
  end
end
