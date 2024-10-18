# frozen_string_literal: true

module Signups
  class Create
    include AutoInject[
      encrypt: 'services.signups.passwords.encrypt'
    ]

    def call(params)
      params.merge!(password: encrypt.(params[:password]))
      params.delete(:password_confirmation)
      params.merge!(
        confirmation_sent_at: Time.now.utc,
        confirmation_token:  confirmation_token)
      Signup.create(params)
    end


    private

    def confirmation_token
      token = nil
      loop do
        token = Devise.friendly_token
        break if !Signup.exists?(confirmation_token: token)
      end
        
      token
    end
  end
end
