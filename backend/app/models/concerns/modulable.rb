# frozen_string_literal: true

module Concerns
  module Modulable
    extend ActiveSupport::Concern

    included do
      include AASM
    end

    module ClassMethods
      def states
        aasm.state_machine.events.keys
      end
    end
  end
end
