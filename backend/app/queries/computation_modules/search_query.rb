# frozen_string_literal: true

module ComputationModules
  class SearchQuery
    def call(query, scope = ComputationModule.all)
      return scope if query.blank?

      scope.where(
        [
          '(computation_modules.title ILIKE :query)',
          '(computation_modules.uid ILIKE :query)',
          "computation_modules.keywords @> '#{[query.downcase].to_json}'"
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
