# frozen_string_literal: true

class BaseRequest < ApplicationRecord
  include Concerns::Modulable

  belongs_to :author, class_name: 'User'
  belongs_to :computation_form

  has_one :computation_result, dependent: :destroy
  has_one :attachment, as: :attachable, dependent: :destroy

  accepts_nested_attributes_for :attachment
end
