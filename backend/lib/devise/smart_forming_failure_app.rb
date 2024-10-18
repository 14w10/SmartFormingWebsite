# frozen_string_literal: true

module Devise
  class SmartFormingFailureApp < Devise::FailureApp
    def respond
      if request.controller_class.to_s.start_with? 'Api::'
        json_api_error_response
      else
        super
      end
    end

    private

    def json_api_error_response
      self.status = 401
    end
  end
end
