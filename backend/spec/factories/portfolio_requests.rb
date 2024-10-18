# frozen_string_literal: true

FactoryBot.define do
  factory :portfolio_request, class: 'PortfolioRequest' do
    status { :new }

    before(:create) do |record, params|
      record.author = params.author || create(:user, signup_id: create(:signup, :approved).id)
      record.portfolio_module = create(:portfolio_module, :published)
    end

    trait :approved do
      status { :approved }
      approved_at { Time.current }
    end

    trait :declined do
      status { :declined }
      declined_at { Time.current }
      decline_reason { 'Declone Reason' }
    end
  end
end
