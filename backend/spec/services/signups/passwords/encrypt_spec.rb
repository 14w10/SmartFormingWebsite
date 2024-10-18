# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::Passwords::Encrypt do
  describe '#call' do
    let(:secret) { 'secret' }
    let(:salt) { 'salt' }
    let(:password) { 'password' }
    let(:service) { described_class.new }
    let(:result) { service.(password, secret, salt) }

    it 'encrypts password' do
      expect(password).not_to eql(result)
    end
  end
end
