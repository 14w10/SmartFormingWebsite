# frozen_string_literal: true

class Category < ApplicationRecord
  include IconUploader::Attachment(:icon)

  has_many :computation_modules

  accepts_nested_attributes_for :computation_modules, update_only: true
end
