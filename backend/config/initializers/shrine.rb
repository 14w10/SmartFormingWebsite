require 'shrine'

Shrine.logger = Rails.logger

if Rails.env.test? || Rails.env.development?
  require 'shrine/storage/file_system'

  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/cache'),
    store: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/store'),
  }
else
  require 'shrine/storage/s3'

  options = {
    access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    bucket: ENV['AWS_BUCKET'],
    region: ENV['AWS_REGION'],
    secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
  }

  Shrine.storages = {
    cache: Shrine::Storage::S3.new(prefix: 'cache', **options),
    store: Shrine::Storage::S3.new(**options),
  }
end

Shrine.plugin :activerecord
Shrine.plugin :instrumentation
Shrine.plugin :determine_mime_type, analyzer: :mime_types
Shrine.plugin :derivatives, create_on_promote: true
Shrine.plugin :add_metadata
Shrine.plugin :cached_attachment_data
Shrine.plugin :restore_cached_data
Shrine.plugin :validation_helpers

if Rails.env.test?
  Shrine.plugin :upload_endpoint, log_subscriber: nil
else
  Shrine.plugin :presign_endpoint, presign_options: -> (request) {
    filename = request.params['filename']
    type = request.params['type']

    {
      content_disposition: ContentDisposition.inline(filename),
      content_type: type,
      content_length_range: 0..(50 * 1024 * 1024)
    }
  }
end
