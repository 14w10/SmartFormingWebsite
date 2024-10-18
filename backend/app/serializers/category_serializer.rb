# frozen_string_literal: true

class CategorySerializer < ApplicationSerializer
  set_type :category

  attributes :id,
             :name,
             :created_at,
             :updated_at

  attribute :published_computation_modules_count do |record|
    record.computation_modules.published.count
  end

  attribute :icon do |record|
    if record.icon_data.nil?
      nil
    else
      {
        data: record.icon_data,
        url: record&.icon_url,
        metadata: record.icon&.metadata
      }
    end
  end
end
