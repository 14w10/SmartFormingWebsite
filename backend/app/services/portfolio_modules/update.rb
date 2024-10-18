# frozen_string_literal: true

module PortfolioModules
  class Update
    def call(portfolio_module, params)
      portfolio_module.update(params)
      portfolio_module
    end
  end
end
