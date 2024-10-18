# frozen_string_literal: true

class ComputationResultSerializer < ApplicationSerializer
  attributes :id, :data, :parameters

  attribute :axis do |record|
    record.data.keys
  end

  attribute :result_url do |record|
    if record.file.blank?
      nil
    else
      disposition = "attachment; filename=computation_results.zip"
      record.file.url(response_content_disposition: disposition)
    end
  end

  attribute :link do |record|
    #Attachment.new(file_data:{"id"=>"ff840482ff45c1af6ad7647d4bc7f23a.zip", "storage"=>"store", "metadata"=>{"filename"=>"Final_Displayer_Shakuro.zip", "size"=>108470047, "mime_type"=>"application/zip"}}).file.url
    if record.file.blank?
      nil
    else
      disposition = "attachment; filename=computation_results.zip"
      record.file.url(response_content_disposition: disposition)
    end
  end
end
