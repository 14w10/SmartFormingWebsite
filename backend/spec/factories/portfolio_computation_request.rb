# frozen_string_literal: true

FactoryBot.define do
    factory :portfolio_computation_request, class: 'PortfolioComputationRequest' do
        computation_form
        association :author, factory: :user
    end
end
  