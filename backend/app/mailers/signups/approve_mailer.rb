# frozen_string_literal: true

module Signups
  class ApproveMailer < ApplicationMailer
    def call(signup)
      @signup = signup
      mail(to: @signup.email, subject: subject)
    end

    private

    def subject
      'Smart Forming:Your signup request confirmed'
    end
  end
end
