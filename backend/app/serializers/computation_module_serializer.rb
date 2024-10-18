# frozen_string_literal: true

class ComputationModuleSerializer < ApplicationSerializer
  set_type :computation_module

  attributes :id,
             :title,
             :short_description,
             :category_id,
             :on_main_page,
             :description,
             :status,
             :keywords,
             :module_type,
             :module_content_type,
             :reject_reason,
             :approved_at,
             :rejected_at,
             :review_started_at,
             :published_at,
             :uid,
             :created_at,
             :updated_at

  attribute :computation_form_id do |record|
    record&.computation_form&.id
  end

  attribute :cover do |record|
    if record.cover_data.nil?
      nil
    else
      {
        data: record.cover_data,
        url: record&.cover_url,
        croppedUrl: record&.cover_url(:cropped),
        metadata: record.cover&.metadata
      }
    end
  end

  belongs_to :author, serializer: ComputationModules::AuthorSerializer
  has_many :attachments, polymorphic: true, serializer: AttachmentSerializer
  has_many :datasets, serializer: ::DatasetSerializer do |record|
    record.datasets
  end
end
