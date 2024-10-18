# frozen_string_literal: true

FactoryBot.define do
  factory :signup, class: 'Signup' do
    title { ['miss', 'mr'].sample }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    phone_number { Faker::PhoneNumber.cell_phone }
    email { Faker::Internet.email }
    password { 'BNcQel8Pda7L3IdP7opW0wpU--UFNJt7QZHZSzQwtP--Rj/dBKHERqXg4DgUkB9DUQ==' }
    role { 'ROLE' }
    position { 'POSITION' }
    confirmation_token { Faker::PhoneNumber.cell_phone }

    organization_name { Faker::Company.name }
    organization_address { Faker::Address.street_address }
    organization_postcode { Faker::Address.zip_code }
    organization_country { Faker::Address.country }
    organization_business { Signup.organization_businesses.keys.sample }

    website { Faker::Internet.url(host: 'website.com') }
    linkedin { Faker::Internet.url(host: 'linkedin.com') }
    research_gate { Faker::Internet.url(host: 'researchgate.com') }
    other_link { Faker::Internet.url(host: 'example.com') }

    trait :approved do
      status { 'approved' }
    end

    trait :declined do
      status { 'declined' }
    end
  end
end
