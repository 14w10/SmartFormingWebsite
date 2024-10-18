# frozen_string_literal: true

module ComputationRequests
  class FilterQuery
    include Concerns::ChainableQueries
    include AutoInject[
      search: 'queries.computation_requests.search'
    ]

    def call(params, scope = ComputationRequest.all)
      chain_queries(params, scope) do |param|
        case param
        when :search then search
        when :status then status
        end
      end
    end

    private

    def status
      ->(value, scope) { scope.where(status: value) }
    end
  end
end
