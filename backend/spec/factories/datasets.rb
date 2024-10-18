# frozen_string_literal: true

FactoryBot.define do
  factory :dataset, class: 'Dataset' do
    file_data { CoverData.image_data }
  end
end
