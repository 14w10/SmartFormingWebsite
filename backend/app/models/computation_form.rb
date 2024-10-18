# frozen_string_literal: true

class ComputationForm < ApplicationRecord
  belongs_to :computation_module

  has_many :computation_requests, dependent: :destroy
end
