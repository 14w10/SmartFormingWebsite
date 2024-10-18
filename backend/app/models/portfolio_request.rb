# frozen_string_literal: true

class PortfolioRequest < ApplicationRecord
  include Concerns::Modulable

  aasm whiny_transitions: false, column: :status do
    state :new, initial: true
    state :approved
    state :declined

    event :approved do
      transitions from: :new, to: :approved
    end

    event :declined do
      transitions from: :new, to: :declined
    end
  end

  has_many :portfolio_computation_requests
  
  belongs_to :portfolio_module
  belongs_to :author, class_name: 'User'
end
