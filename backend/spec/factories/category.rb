# frozen_string_literal: true

require './spec/icon_data'

FactoryBot.define do
  factory :category do
    name { Faker::Science.element }
    icon_data { IconData.image_data }
  end
end
