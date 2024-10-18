# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Register do
  describe '#call' do
    let!(:signup)  { create(:signup) }
    let(:decrypt)  { Signups::Passwords::Decrypt.new }
    let(:password) { decrypt.(signup.password) }
    let(:service)  { described_class.new }
    let(:result)   { service.(signup) }

    it 'creates user' do
      expect(result).to be_kind_of(User)
      expect(result.email).to eq(signup.email)
      expect(result.valid_password?(password)).to be
    end
  end
end
