# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    title { ['miss', 'mr'].sample }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    phone_number { Faker::PhoneNumber.cell_phone }
    email { Faker::Internet.email }
    role { :user }
    password { '12345678' }
    password_confirmation { '12345678' }

    trait :admin do
      role { :admin }
    end

    trait :editor do
      role { :editor }
    end
    
    signup
  end
end
