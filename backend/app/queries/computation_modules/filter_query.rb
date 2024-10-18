# frozen_string_literal: true

module ComputationModules
  class FilterQuery
    include Concerns::ChainableQueries
    include AutoInject[
      search: 'queries.computation_modules.search'
    ]

    def call(params, scope = ComputationModule.all)
      chain_queries(params, scope) do |param|
        case param
        when :category_id then category_id
        when :on_main_page then on_main_page
        when :search then search
        when :status then status
        when :module_type then module_type
        end
      end
    end

    private

    def status
      ->(value, scope) { scope.where(status: value) }
    end

    def module_type
      ->(value, scope) { scope.where(module_type: value) }
    end

    def category_id
      ->(value, scope) { scope.where(category_id: value) }
    end

    def on_main_page
      ->(value, scope) { scope.where(on_main_page: value) }
    end
  end
end
