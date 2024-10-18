# frozen_string_literal: true

class Attachment < ApplicationRecord
  include AttachmentUploader::Attachment.new(:file)

  belongs_to :attachable, polymorphic: true

  enum file_type: {
    functional_module: 0,
    verification_report: 10,
    computation_request_data: 20,
    computation_request_result: 30,
    verified_portfolio_module: 40,
    verification_portfolio_report: 50
  }
end
