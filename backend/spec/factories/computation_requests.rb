# frozen_string_literal: true

FactoryBot.define do
  factory :computation_request, class: 'ComputationRequest' do
    status { :new }

    before(:create) do |record, params|
      record.author = params.author || create(:user, signup_id: create(:signup, :approved).id)
      record.computation_form = create(:computation_form)
    end

    trait :processing do
      status { :processing }
      processed_at { Time.current }
    end

    trait :finished do
      status { :finished }
      finished_at { Time.current }
    end

    trait :declined do
      status { :declined }
      declined_at { Time.current }
    end
  end
end
