require 'factory_bot_rails'

unless Rails.env.production?
  email = 'super@admin.sf'

  unless User.where(email: email).exists?
    FactoryBot.create(:user, :admin, email: email)

    10.times do
      FactoryBot.create(:user, :admin)
      FactoryBot.create(:user, :editor)

      FactoryBot.create(:signup)
      FactoryBot.create(:signup, :declined)

      FactoryBot.create(:signup, :approved).tap do |signup|
        FactoryBot.create(
          :user,
          email: signup.email,
          first_name: signup.first_name,
          last_name: signup.last_name,
          phone_number: signup.phone_number,
          signup_id: signup.id
        )
      end

      FactoryBot.create(:computation_module)
    end
  end
end
