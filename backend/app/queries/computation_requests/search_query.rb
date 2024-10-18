# frozen_string_literal: true

module ComputationRequests
  class SearchQuery
    def call(query, scope = ComputationRequest.all)
      return scope if query.blank?

      scope.left_joins(computation_form: :computation_module).where(
        [
          '(computation_modules.title ILIKE :query)',
          '(computation_modules.description ILIKE :query)'
        ].join(' OR '),
        query: "%#{query}%"
      )
    end
  end
end
