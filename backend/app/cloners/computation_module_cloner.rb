class ComputationModuleCloner < Clowne::Cloner
  adapter :active_record
  nullify :uid, :rejected_at, :reject_reason, :cover_data
  
  include_association :computation_form
  include_association :attachments

  # params here is an arbitrary Hash passed into cloner
  finalize do |_source, record, params|
    record.title = _source.title + " COPY-#{SecureRandom.alphanumeric(10)}"
    record.status = :under_review
    
    if _source.cover
      record.cover = _source.cover.download
      record.cover.metadata.merge!('crop' => _source.cover.metadata['crop'])
    end
  end
end
