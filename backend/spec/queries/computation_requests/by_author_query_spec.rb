# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::ByAuthorQuery do
  describe '#call' do
    let(:computation_request1) { create(:computation_request) }
    let(:computation_request2) { create(:computation_request) }
    let(:query) { described_class.new }
    let(:result) { query.(computation_request1.author.id) }

    it 'filters by author' do
      expect(result).to include(computation_request1)
      expect(result).not_to include(computation_request2)
    end
  end
end
