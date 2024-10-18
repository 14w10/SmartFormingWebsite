# frozen_string_literal: true

module Store
  class PortfolioModuleSerializer < ApplicationSerializer
    set_type :portfolio_module

    attributes :id,
               :title,
               :description,
               :status,
               :keywords,
               :reject_reason,
               :rejected_at,
               :review_started_at,
               :published_at,
               :created_at,
               :updated_at

    attribute :computation_modules_array do |record|
      PortfolioComputationModulePresenter.new(record).prepared_data
    end

    attribute :cover do |record|
      if record.cover_data
        {
          data: record.cover_data,
          url: record&.cover_url,
          croppedUrl: record&.cover_url(:cropped),
          metadata: record.cover&.metadata
        }
      end
    end
  
    has_many :portfolio_computation_modules, serializer: PortfolioComputationModuleSerializer
    has_many :coauthors, serializer: CoauthorSerializer
    belongs_to :author, serializer: PortfolioModules::AuthorSerializer
  end
end
