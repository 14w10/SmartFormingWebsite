# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::Admins::File do
  describe '#call' do
    let(:computation_request) { create(:computation_request) }
    let(:service) { described_class.new }
    let(:result) { service.(computation_request) }

    it 'returns file' do
      expect(result).to be
    end
  end
end
