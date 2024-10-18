# frozen_string_literal: true

module Signups
  class ConfirmMailer < ApplicationMailer
    def call(signup)
      @signup = signup
      mail(to: @signup.email, subject: subject)
    end

    private

    def subject
      'Smart Forming: Please confirm your signup request'
    end
  end
end
