# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortfolioRequests::SearchQuery do
  describe '#call' do
    let(:query) { described_class.new }

    it 'finds by portfolio module title' do
      record = create(:portfolio_request)
      search = record.portfolio_module.title
      expect(query.(search)).to match_array [record]
    end

    it 'finds by portfolio module description' do
      record = create(:portfolio_request)
      search = record.portfolio_module.description
      expect(query.(search)).to match_array [record]
    end

    it 'returns default scope if query string is blank' do
      expect(query.('').to_sql).to eq PortfolioRequest.all.to_sql
    end
  end
end
