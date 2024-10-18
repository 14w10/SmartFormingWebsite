# frozen_string_literal: true

module DeviseHelper
  extend ActiveSupport::Concern

  included do
    User.roles.keys.each do |role|
      define_method(:"login_as_#{role}") do |user|
        login_as(role, user)
      end
    end
  end

  def stub_current(record)
    allow(@controller).to receive(:current_user).and_return(record)
  end

  def stub_record(symbol, record)
    allow(@controller).to receive(symbol).and_return(record)
  end

  # rubocop:disable Metrics/AbcSize
  def sign_in(user = double('User'))
    if user.nil?
      allow(request.env['warden']).to receive(:authenticate!).and_throw(:warden, scope: :user)
      allow(@controller).to receive(:current_user).and_return(nil)
    else
      allow(request.env['warden']).to receive(:authenticate!).and_return(user)
      allow(@controller).to receive(:current_user).and_return(user)
    end
  end
  # rubocop:enable Metrics/AbcSize

  private

  def login_as(role, user)
    allow(@controller).to receive(:"authorize_#{role}!").and_return(user)
    allow(@controller).to receive(:current_user).and_return(user)
  end
end
