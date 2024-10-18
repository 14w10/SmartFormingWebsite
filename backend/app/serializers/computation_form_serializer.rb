# frozen_string_literal: true

class ComputationFormSerializer < ApplicationSerializer
  set_type :computation_form

  attributes :id

  belongs_to :computation_module
end
