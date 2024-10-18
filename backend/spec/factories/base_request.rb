# frozen_string_literal: true

FactoryBot.define do
    factory :base_request, class: 'BaseRequest' do
        computation_form
        association :author, factory: :user
    end
  end
  