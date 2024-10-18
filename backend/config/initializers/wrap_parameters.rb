# frozen_string_literal: true

module ActionController::ParamsNormalizer
  extend ActiveSupport::Concern

  def process_action(*args)
    deep_underscore_params!(request.query_parameters)
    deep_underscore_params!(request.request_parameters)
    super
  end

  private

  def deep_underscore_params!(params)
    params.deep_transform_keys! { |k| k.to_s.underscore }
  end
end

ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: [:json] if respond_to?(:wrap_parameters)

  include ::ActionController::ParamsNormalizer
end
