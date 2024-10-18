# frozen_string_literal: true

class ComputationRequest < BaseRequest
  aasm whiny_transitions: false, column: :status do
    state :new, initial: true
    state :processing
    state :finished
    state :declined

    event :processing do
      transitions from: :new, to: :processing
    end

    event :finished do
      transitions from: :processing, to: :finished
    end

    event :declined do
      transitions from: :new, to: :declined
    end
  end
end
