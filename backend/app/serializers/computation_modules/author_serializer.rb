# frozen_string_literal: true

module ComputationModules
  class AuthorSerializer < ApplicationSerializer
    set_type :author

    attributes :id,
               :title,
               :first_name,
               :last_name,
               :phone_number,
               :role,
               :updated_at
  end
end
