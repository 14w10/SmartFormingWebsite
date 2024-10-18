# frozen_string_literal: true

module Users
  class Register
    include AutoInject[
      decrypt: 'services.signups.passwords.decrypt'
    ]

    def call(signup)
      params = signup.slice(
        :title,
        :first_name,
        :last_name,
        :phone_number,
        :email
      ).merge(
        signup_id: signup.id,
        password: decrypted(signup.password),
        password_confirmation: decrypted(signup.password)
      )

      User.create(params)
    end

    private

    def decrypted(encrypted_password)
      @decrypted ||= decrypt.(encrypted_password)
    end
  end
end
