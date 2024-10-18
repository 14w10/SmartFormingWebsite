# frozen_string_literal: true

require 'openssl'

module Signups
  module Passwords
    class Decrypt
      def call(
        encrypted_password,
        secret = ENV.fetch('ENCRYPT_SECRET'),
        salt = ENV.fetch('ENCRYPT_SALT')
      )
        key = ActiveSupport::KeyGenerator.new(secret).generate_key(salt, 32)
        crypt = ActiveSupport::MessageEncryptor.new(key)
        crypt.decrypt_and_verify(encrypted_password)
      end
    end
  end
end
