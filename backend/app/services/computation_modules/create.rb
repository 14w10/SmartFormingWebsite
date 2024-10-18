# frozen_string_literal: true

module ComputationModules
  class Create
    def call(params)
      attachments_attributes = params.delete(:attachments_attributes).map do |atts|
        atts.merge(file: atts[:file].to_json)
      end

      if params[:datasets_attributes]
        datasets_attributes = params.delete(:datasets_attributes).map do |atts|
          atts.merge(file: atts[:file].to_json)
        end
      end

      params.merge!(attachments_attributes: attachments_attributes) if attachments_attributes
      params.merge!(datasets_attributes: datasets_attributes) if datasets_attributes

      ComputationModule.create!(params)
    end
  end
end
