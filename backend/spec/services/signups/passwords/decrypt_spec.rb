# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::Passwords::Decrypt do
  describe '#call' do
    let(:secret) { 'secret' }
    let(:salt) { 'salt' }
    let(:password) { '8yZYCAI3xhsnLoQyOpEq6uOR--Ot6cwMXwLzleLYqS--OkfFON75vNMO6Mk/fMTSmw==' }
    let(:encrypted_password) { 'password' }
    let(:service) { described_class.new }
    let(:result) { service.(password, secret, salt) }

    it 'decrypts password' do
      expect(encrypted_password).to eql(result)
    end
  end
end
