# frozen_string_literal: true

class ComputationModule < ApplicationRecord
  include CoverUploader::Attachment(:cover)
  include Concerns::Modulable

  aasm whiny_transitions: false, column: :status do
    state :new, initial: true
    state :under_review
    state :approved
    state :rejected
    state :published

    event :under_review do
      transitions from: :new, to: :under_review
    end

    event :pre_approved do
      transitions from: :new, to: :approved
    end

    event :approved do
      transitions from: :under_review, to: :approved
    end

    event :rejected do
      transitions from: :under_review, to: :rejected
    end

    event :published do
      transitions from: :approved, to: :published, if: :allow_to_publish?
    end
  end

  belongs_to :author, class_name: 'User'
  belongs_to :category

  has_one :computation_form, dependent: :destroy

  has_many :attachments, as: :attachable, dependent: :destroy
  has_many :datasets, dependent: :destroy
  
  has_many :portfolio_computation_modules
  has_many :portfolio_modules, through: :portfolio_computation_modules

  accepts_nested_attributes_for :datasets, allow_destroy: true
  accepts_nested_attributes_for :attachments, allow_destroy: true

  enum module_type: { 'pre-fe': 0, 'post-fe': 1 }

  enum module_content_type: { functional_module: 0, data_module: 1 }

  def allow_to_publish?
    computation_form? || data_module?
  end

  def computation_form?
    computation_form.present?
  end
end
