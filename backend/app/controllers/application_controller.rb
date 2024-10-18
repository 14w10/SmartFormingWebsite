# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  class UnauthorizedError < StandardError; end
  class ForbiddenError < StandardError; end
end
