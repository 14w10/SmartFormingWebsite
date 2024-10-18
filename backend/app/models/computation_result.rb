# frozen_string_literal: true

class ComputationResult < ApplicationRecord
  belongs_to :base_request
  include AttachmentUploader::Attachment.new(:file)

  enum typ: {
    custom: :custom,
    mesh3d: :mesh3d,
    lines: :lines,
    scatter: :scatter,
    bar: :bar,
    scatter3d: :scatter3d,
    surface: :surface,
    '3dlines': '3dlines'
  }
end
