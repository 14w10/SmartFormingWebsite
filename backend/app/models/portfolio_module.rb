# frozen_string_literal: true

class PortfolioModule < ApplicationRecord
  include CoverUploader::Attachment(:cover)
  include Concerns::Modulable

  aasm whiny_transitions: false, column: :status do
    state :new, initial: true
    state :under_review
    state :rejected
    state :published

    event :under_review do
      transitions from: :new, to: :under_review
    end

    event :rejected do
      transitions from: :under_review, to: :rejected
    end

    event :published do
      transitions from: :under_review, to: :published
    end
  end

  belongs_to :author, class_name: 'User'

  has_many :portfolio_requests, dependent: :destroy
  has_many :portfolio_computation_modules
  has_many :computation_modules, through: :portfolio_computation_modules
  has_many :coauthors

  accepts_nested_attributes_for :portfolio_computation_modules
  accepts_nested_attributes_for :coauthors
end
