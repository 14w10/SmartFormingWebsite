# frozen_string_literal: true

module Signups
  class SearchQuery
    def call(query, scope = Signup.all)
      return scope if query.blank?

      scope.where(
        [
          "((signups.first_name || ' ' || signups.last_name) ILIKE :query)",
          '(signups.email ILIKE :query)'
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
