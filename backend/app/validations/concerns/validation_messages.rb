# frozen_string_literal: true

module Concerns
  module ValidationMessages
    extend ActiveSupport::Concern

    included do
      config.messages_file = Rails.root.join('config', 'locales', 'errors.en.yml')
    end
  end
end
