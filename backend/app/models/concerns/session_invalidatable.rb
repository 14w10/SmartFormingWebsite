# frozen_string_literal: true

module Concerns
  module SessionInvalidatable
    extend ActiveSupport::Concern

    def authenticatable_salt
      "#{super}#{session_token}"
    end

    def invalidate_all_sessions!
      update_attribute(:session_token, SecureRandom.hex)
    end
  end
end
