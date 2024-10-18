# frozen_string_literal: true

module ComputationRequests
  class Create
    def call(computation_form, params)
      steps = params.delete(:steps)

      params.merge!(
        meta: { steps: steps }
      )
      attachment_attributes = params.delete(:attachment_attributes)
      if !attachment_attributes.blank? 
        attachment_attributes.merge!(file: attachment_attributes[:file].to_json)
        params.merge!(attachment_attributes: attachment_attributes)
      end

      request = computation_form.computation_requests.create(params)
      
      request
    end
  end
end
