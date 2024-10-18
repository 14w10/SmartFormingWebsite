# frozen_string_literal: true

module PortfolioComputationRequests
  class PreparedParams
    def call(params)
      params = params.require(:computation_request).to_unsafe_h
      params.merge!(meta: { steps: params.delete(:steps) })
      attachment_attributes = params.delete(:attachment_attributes)
      return params if attachment_attributes.blank?

      attachment_attributes.transform_values! do |value|
        value.respond_to?(:underscore) ? value.underscore : value
      end
      attachment_attributes.merge!(file: attachment_attributes[:file].to_json)

      params.merge(
        attachment_attributes: attachment_attributes
      )
    end
  end
end
