# frozen_string_literal: true

module Api
  class SignupsController < Api::BaseController
    include AutoInject[
      create_validation: 'validations.signups.create_validation',
      create_signup: 'services.signups.create',
      confirm_mailer: 'mailers.signups.confirm_mailer',
      serializer: 'serializers.signup'
    ]

    skip_before_action :authorize_user!

    def create
      if validation.success?
        signup = create_signup.(signup_params.merge(status: 'new'))
        confirm_mailer.(signup).deliver_later
        render json: serializer.new(signup).serialized_json, status: :created
      else
        render_json_errors(validation.errors, :unprocessable_entity)
      end
    end

    private

    def signup_params
      params.require(:signup).permit(
        :title, :first_name, :last_name, :phone_number, :email, :password,
        :password_confirmation, :position, :role, :organization_name, :organization_address,
        :organization_postcode, :organization_country, :organization_business, :website,
        :linkedin, :research_gate, :other_link
      ).to_h
    end

    def validation
      create_validation.(signup_params)
    end
  end
end
