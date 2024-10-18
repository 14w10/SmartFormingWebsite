# frozen_string_literal: true

class AdminSerializer < ApplicationSerializer
  set_type :user

  attributes :id,
             :first_name,
             :last_name,
             :email,
             :role,
             :updated_at
end
