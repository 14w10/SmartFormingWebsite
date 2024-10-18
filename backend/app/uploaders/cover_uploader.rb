class CoverUploader < Shrine
  MAX_SIZE       = 5*1024*1024
  ALLOWED_EXTS   = %w[jpg jpeg png]
  ALLOWED_TYPES  = %w[image/jpeg image/png]
  IMAGE_DIMENSIONS = [384..5000, 512..5000]

  plugin :store_dimensions, analyzer: :fastimage, log_subscriber: nil
  plugin :derivatives, create_on_promote: true
  
  Attacher.validate do
    validate_max_size MAX_SIZE
    validate_extension ALLOWED_EXTS
    if validate_mime_type ALLOWED_TYPES
      validate_dimensions IMAGE_DIMENSIONS
    end
  end

  Attacher.derivatives do |original|
    vips = ImageProcessing::Vips.source(original)
    {
      cropped: vips.crop!(*file.crop_points)
    }
  end

  class UploadedFile
    def crop_points
      metadata.fetch("crop").fetch_values("x", "y", "width", "height")
    end
  end
end
