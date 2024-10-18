# frozen_string_literal: true

module ComputationModules
  module Admins
    class Destroy
      # rubocop:disable Metrics/MethodLength
      def call(computation_module)
        computation_module.destroy!
      end
      # rubocop:enable Metrics/MethodLength
    end
  end
end
