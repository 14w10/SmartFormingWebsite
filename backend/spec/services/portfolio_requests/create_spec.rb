# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortfolioRequests::Create do
  describe '#call' do
    let!(:author) { create(:user) }
    let!(:portfolio_module) { create(:portfolio_module, :published, author: author) }
    let(:service) { described_class.new }
    let(:result) { service.(portfolio_module, params) }
    let(:params) do
      {
        author_id: author.id,
        portfolio_module_id: portfolio_module.id,
        portfolio_computation_request_ids: []
      }
    end

    it 'creates computation_request' do
      expect(result).to be_kind_of(PortfolioRequest)
      expect(result.persisted?).to be
    end
  end
end
