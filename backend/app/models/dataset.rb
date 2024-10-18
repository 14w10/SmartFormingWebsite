# frozen_string_literal: true

class Dataset < ApplicationRecord
  include AttachmentUploader::Attachment.new(:file)

  belongs_to :computation_module

  validates :price, numericality: { greater_than_or_equal_to: 0.01 }, allow_nil: true
end
