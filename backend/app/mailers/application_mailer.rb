# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  add_template_helper(ApplicationHelper)

  default from: ADMIN_EMAIL

  layout 'mailer'
end
