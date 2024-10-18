# frozen_string_literal: true

module Store
  class ComputationModuleSerializer < ApplicationSerializer
    set_type :computation_module

    attributes :id,
               :title,
               :short_description,
               :description,
               :category_id,
               :on_main_page,
               :status,
               :module_type,
               :module_content_type,
               :reject_reason,
               :approved_at,
               :rejected_at,
               :review_started_at,
               :published_at,
               :keywords,
               :uid,
               :created_at,
               :updated_at

    attribute :computation_form_id do |record|
      record&.computation_form&.id
    end

    attribute :cover do |record|
      {
        croppedUrl: record&.cover_url(:cropped)
      }
    end

    belongs_to :author, serializer: ComputationModules::AuthorSerializer
    has_many :attachments, polymorphic: true, serializer: ::AttachmentSerializer do |record|
      record.attachments.verification_report
    end

    has_many :datasets, serializer: DatasetSerializer
  end
end
