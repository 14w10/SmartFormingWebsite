# frozen_string_literal: true

module Coauthors
  class CreateMailer < ApplicationMailer
    def call(coauthor)
      @coauthor = coauthor
      mail(to: coauthor.email, subject: subject)
    end

    private

    def subject
      'You have been listed as a Co-Author'
    end
  end
end