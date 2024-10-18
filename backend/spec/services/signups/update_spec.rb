# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::Update do
  describe '#call' do
    let!(:signup) { create(:signup) }
    let(:params) do
      {
        status: 'approve'
      }
    end
    let(:service) { described_class.new }
    let(:result) { service.(signup, params) }

    it 'creates signup' do
      expect(result.approved?).to be
    end
  end
end
