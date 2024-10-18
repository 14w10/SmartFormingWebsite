# frozen_string_literal: true

require './spec/cover_data.rb'

FactoryBot.define do
  factory :computation_module, class: 'ComputationModule' do
    title { Faker::Company.catch_phrase }
    module_type { :'post-fe' }
    short_description { Faker::Company.catch_phrase }
    description { Faker::Company.catch_phrase }
    status { :new }
    module_content_type { :data_module }
    cover_data { CoverData.image_data }
    keywords { [:test] }

    category

    before(:create) do |record|
      record.author = create(:user, signup_id: create(:signup, :approved).id)
    end

    trait :approved do
      status { :approved }
      approved_at { Time.current }
    end

    trait :rejected do
      status { :rejected }
      rejected_at { Time.current }
    end

    trait :published do
      status { :published }
      published_at { Time.current }
    end

    trait :under_review do
      status { :under_review }
      review_started_at { Time.current }
    end
  end
end
