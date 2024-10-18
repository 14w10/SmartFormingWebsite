# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortfolioComputationModulePresenter do
  describe '#prepare_data' do
    let(:portfolio_module) { create(:portfolio_module) }
    let(:result) { described_class.new(portfolio_module).prepared_data }
    let(:expected) {
      {
        'post-fe' => [portfolio_module.portfolio_computation_modules.first.computation_module_id]
      }
    }
    it 'returns data' do
      expect(result).to include(expected)
    end
  end
end
