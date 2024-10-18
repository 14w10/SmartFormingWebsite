# frozen_string_literal: true

FactoryBot.define do
  factory :portfolio_computation_module, class: 'PortfolioComputationModule' do
    portfolio_module
    computation_module
    sequence(:sort_index, 0)
  end
end
