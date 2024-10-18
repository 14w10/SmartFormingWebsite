# frozen_string_literal: true

module Signups
  class DeclineMailer < ApplicationMailer
    def call(signup)
      @signup = signup
      mail(to: @signup.email, subject: subject)
    end

    private

    def subject
      'Smart Forming: We declined your signup request'
    end
  end
end
