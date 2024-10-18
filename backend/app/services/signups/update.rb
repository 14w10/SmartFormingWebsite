# frozen_string_literal: true

module Signups
  class Update
    include AutoInject[
      approve_mailer: 'mailers.signups.approve_mailer',
      decline_mailer: 'mailers.signups.decline_mailer',
      register_user: 'services.users.register'
    ]

    def call(signup, params)
      case params[:status]
      when 'approve'
        signup.approve!
        register_user.(signup)
        approve_mailer.(signup).deliver_later
      when 'decline'
        signup.decline!
        signup.update(params.slice(:decline_reason))
        decline_mailer.(signup).deliver_later
      end

      signup
    end
  end
end
