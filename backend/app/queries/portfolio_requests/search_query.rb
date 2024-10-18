# frozen_string_literal: true

module PortfolioRequests
  class SearchQuery
    def call(query, scope = PortfolioRequest.all)
      return scope if query.blank?

      scope.left_joins(:portfolio_module).where(
        [
          '(portfolio_modules.title ILIKE :query)',
          '(portfolio_modules.description ILIKE :query)'
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
