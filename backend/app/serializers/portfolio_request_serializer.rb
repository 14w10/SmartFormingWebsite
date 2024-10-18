# frozen_string_literal: true

class PortfolioRequestSerializer < ApplicationSerializer
  set_type :portfolio_request

  attributes :id,
             :status,
             :decline_reason,
             :meta,
             :approved_at,
             :declined_at,
             :created_at,
             :updated_at

  attribute :portfolio_module_id do |record|
    record&.portfolio_module&.id
  end

  attribute :title do |record|
    record&.portfolio_module&.title
  end

  attribute :description do |record|
    record&.portfolio_module&.description
  end

  has_many :portfolio_computation_requests, serializer: PortfolioComputationRequestSerializer
  belongs_to :author, serializer: ComputationModules::AuthorSerializer
  belongs_to :portfolio_module, serializer: PortfolioModuleSerializer
end
