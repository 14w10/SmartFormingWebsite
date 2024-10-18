# frozen_string_literal: true

MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

TITLE_MAX_SIZE = 100
MODULE_UID_MAX_SIZE = 50

MANGER_ROLES = [
  'admin',
  'editor'
].freeze

if Rails.env.development? || Rails.env.test?
  ADMIN_EMAIL = 'smartforming-staging@localhost.dev'
  NO_REPLY_EMAIL = 'smartforming-staging@localhost.dev'
end

if Rails.env.staging?
  ADMIN_EMAIL = 'smartforming-staging@yandex.com'
  NO_REPLY_EMAIL = 'smartforming-staging@yandex.com'
end

if Rails.env.production?
  ADMIN_EMAIL = 'admin@smartforming.com'
  NO_REPLY_EMAIL = 'no-reply@smartforming.com'
end
