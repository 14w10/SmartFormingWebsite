# frozen_string_literal: true

module ComputationResults
  module Admins
    class Update
      def call(computation_result, params)
        computation_result.update(params)
        computation_result
      end
    end
  end
end
