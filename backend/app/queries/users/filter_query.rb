# frozen_string_literal: true

module Users
  class FilterQuery
    include Concerns::ChainableQueries
    include AutoInject[
      search: 'queries.users.search'
    ]

    def call(params, scope = User.all)
      chain_queries(params, scope) do |param|
        case param
        when :search then search
        end
      end
    end
  end
end
