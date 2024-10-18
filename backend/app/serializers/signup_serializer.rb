# frozen_string_literal: true

class SignupSerializer < ApplicationSerializer
  set_type :signup

  attributes :id,
             :title,
             :first_name,
             :last_name,
             :phone_number,
             :email,
             :role,
             :position,
             :organization_name,
             :organization_address,
             :organization_postcode,
             :organization_country,
             :organization_business,
             :website,
             :linkedin,
             :research_gate,
             :other_link,
             :status,
             :decline_reason,
             :created_at,
             :updated_at

  has_one :user
end
