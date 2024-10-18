# frozen_string_literal: true

class DatasetSerializer < ApplicationSerializer
  set_type :dataset

  attributes :id,
             :computation_module_id,
             :file_data,
             :price,
             :paid,
             :created_at,
             :updated_at

  attribute :file_url do |record|
    unless record.paid?
      disposition = "attachment; filename=#{record.file.original_filename.inspect}"
      record.file.url(response_content_disposition: disposition)
    end
  end

  belongs_to :computation_module
end
