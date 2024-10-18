# frozen_string_literal: true

module PortfolioComputationRequests
  class Create
    def call(params)
      ::PortfolioComputationRequest.create!(params)
    end
  end
end
