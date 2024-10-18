# frozen_string_literal: true

module Users
  class SearchQuery
    def call(query, scope = User.all)
      return scope if query.blank?

      scope.where(
        [
          "((users.first_name || ' ' || users.last_name) ILIKE :query)",
          '(users.email ILIKE :query)'
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
