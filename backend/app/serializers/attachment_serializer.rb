# frozen_string_literal: true

class AttachmentSerializer < ApplicationSerializer
  set_type :attachment

  attributes :id,
             :attachable_id,
             :attachable_type,
             :label,
             :description,
             :field_name,
             :file_data,
             :created_at,
             :updated_at

  attribute :file_type do |record|
    record.file_type.camelize(:lower)
  end

  attribute :file_url do |record|
    disposition = "attachment; filename=#{record.file.original_filename.inspect}"
    record.file.url(response_content_disposition: disposition)
  end

  belongs_to :attachable, polymorphic: true
end
