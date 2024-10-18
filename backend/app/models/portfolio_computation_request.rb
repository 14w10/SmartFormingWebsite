# frozen_string_literal: true

class PortfolioComputationRequest < BaseRequest
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
end
