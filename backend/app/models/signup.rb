# frozen_string_literal: true

class Signup < ApplicationRecord
  include AASM

  has_one :user, dependent: :destroy

  enum title: [:miss, :mr, :doctor, :professor],
       organization_business: {
         other: 'other',
         academic: 'academic',
         industrial: 'industrial'
       }

  aasm whiny_transitions: false, column: :status do
    state :new, initial: true
    state :approved
    state :declined

    event :approve do
      transitions from: :new, to: :approved, after: :clear_confirmation_token
    end

    event :decline do
      transitions from: :new, to: :declined
    end
  end

  private 
  
  def clear_confirmation_token
    update_column :confirmation_token, nil
  end
end
