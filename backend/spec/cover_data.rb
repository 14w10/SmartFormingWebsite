module CoverData
  module_function
 
  def image_data
    attacher = Shrine::Attacher.new
    attacher.set(uploaded_image)
 
    # # if you're processing derivatives 
    # attacher.set_derivatives(
    #   large:  uploaded_image,
    #   medium: uploaded_image,
    #   small:  uploaded_image,
    # )
 
    JSON.parse attacher.column_data # or attacher.data in case of postgres jsonb column 
  end
 
  def uploaded_image
    file = File.open("spec/files/pexels-pixabay.jpg", binmode: true)
 
    # for performance we skip metadata extraction and assign test metadata 
    uploaded_file = Shrine.upload(file, :store, metadata: false)
    uploaded_file.metadata.merge!(
      size: File.size(file.path),
      mime_type: "image/jpeg",
      filename: "pexels-pixabay.jpg",
      width: 3264,
      height: 2448
    )
 
    uploaded_file
  end
end