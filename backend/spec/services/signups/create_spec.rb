# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::Create do
  describe '#call' do
    let(:signup) { build(:signup).attributes }
    let(:service) { described_class.new }
    let(:result) { service.(signup) }

    it 'creates signup' do
      expect(result).to be_kind_of(Signup)
      expect(result.persisted?).to be
    end
  end
end
