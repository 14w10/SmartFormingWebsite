# frozen_string_literal: true

module Signups
  class FilterQuery
    include Concerns::ChainableQueries
    include AutoInject[
      search: 'queries.signups.search'
    ]

    def call(params, scope = Signup.all)
      chain_queries(params, scope) do |param|
        case param
        when :status then status
        when :search then search
        end
      end
    end

    def status
      ->(value, scope) { scope.where(status: value) }
    end
  end
end
