# frozen_string_literal: true

module PortfolioModules
  class Create
    def call(params)
      PortfolioModule.create!(params)
    end
  end
end
