# frozen_string_literal: true

module Api
  module Admin
    class BaseController < ::BaseController
      before_action :authorize_admin_or_editor!
    end
  end
end
