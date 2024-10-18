# frozen_string_literal: true

class ComputationRequestSerializer < ApplicationSerializer
  set_type :computation_request

  attributes :id,
             :computation_result_id,
             :status,
             :decline_reason,
             :meta,
             :processed_at,
             :finished_at,
             :declined_at,
             :created_at,
             :graph_type,
             :updated_at

  attribute :computation_form_id do |record|
    record&.computation_form&.id
  end

  attribute :computation_module_id do |record|
    record&.computation_form&.computation_module&.id
  end

  attribute :computation_module_title do |record|
    record&.computation_form&.computation_module&.title
  end

  attribute :computation_module_short_description do |record|
    record&.computation_form&.computation_module&.short_description
  end

  attribute :computation_module_description do |record|
    record&.computation_form&.computation_module&.description
  end

  attribute :computation_module_type do |record|
    record&.computation_form&.computation_module&.module_type
  end

  belongs_to :computation_form
  belongs_to :author, serializer: ComputationModules::AuthorSerializer
  has_one :attachment, polymorphic: true, serializer: AttachmentSerializer
end
