# frozen_string_literal: true

module PortfolioModules
  class SearchQuery
    def call(query, scope = PortfolioModule.all)
      return scope if query.blank?

      scope.where(
        [
          '(portfolio_modules.title ILIKE :query)',
          '(portfolio_modules.description ILIKE :query)',
          '(portfolio_modules.status ILIKE :query)'
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
