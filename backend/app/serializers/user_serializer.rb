# frozen_string_literal: true

class UserSerializer < ApplicationSerializer
  set_type :user

  attributes :id,
             :title,
             :first_name,
             :last_name,
             :phone_number,
             :role,
             :updated_at

  belongs_to :signup
end
