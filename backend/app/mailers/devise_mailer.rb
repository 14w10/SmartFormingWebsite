# frozen_string_literal: true

class DeviseMailer < Devise::Mailer
  layout 'mailer'

  def admin_registration_instructions(admin, password, opts = {})
    DeviseMailer.layout 'mailer'
    @admin = admin
    @password = password
    opts[:subject] = 'Smart Forming: Your administrator invitation'
    devise_mail(admin, :admin_registration_instructions, opts)
  end

  def editor_registration_instructions(editor, password, opts = {})
    DeviseMailer.layout 'mailer'
    @editor = editor
    @password = password
    opts[:subject] = 'Smart Forming: Your editor invitation'
    devise_mail(editor, :editor_registration_instructions, opts)
  end

  def reset_password_instructions(record, token, opts = {})
    opts[:subject] = 'Smart Forming: Password change instructions'
    DeviseMailer.layout 'mailer'
    super(record, token, opts)
  end
end
