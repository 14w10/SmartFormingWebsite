# frozen_string_literal: true

module Concerns
  module ChainableQueries
    def chain_queries(params, scope, &_)
      params = params.deep_symbolize_keys.compact
      params.inject(scope) do |result, (key, value)|
        query = yield(key)
        query ? query.(value, result) : result
      end
    end
  end
end
