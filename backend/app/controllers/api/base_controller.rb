# frozen_string_literal: true

module Api
  class BaseController < ::BaseController
    before_action :authorize_user!
  end
end
