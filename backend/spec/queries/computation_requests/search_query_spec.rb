# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::SearchQuery do
  describe '#call' do
    let(:query) { described_class.new }

    it 'finds computation module by title' do
      record = create(:computation_request)
      search = record.computation_form.computation_module.title
      expect(query.(search)).to match_array [record]
    end

    it 'finds computation module by description' do
      record = create(:computation_request)
      search = record.computation_form.computation_module.description
      expect(query.(search)).to match_array [record]
    end

    it 'returns default scope if query string is blank' do
      expect(query.('').to_sql).to eq ComputationRequest.all.to_sql
    end
  end
end
