# frozen_string_literal: true

class EditorSerializer < ApplicationSerializer
  set_type :user

  attributes :id,
             :first_name,
             :last_name,
             :email,
             :role,
             :updated_at
end
