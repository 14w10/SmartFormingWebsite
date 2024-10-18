# frozen_string_literal: true

require 'openssl'

module Signups
  module Passwords
    class Encrypt
      def call(password, secret = ENV.fetch('ENCRYPT_SECRET'), salt = ENV.fetch('ENCRYPT_SALT'))
        key = ActiveSupport::KeyGenerator.new(secret).generate_key(salt, 32)
        crypt = ActiveSupport::MessageEncryptor.new(key)
        crypt.encrypt_and_sign(password)
      end
    end
  end
end
