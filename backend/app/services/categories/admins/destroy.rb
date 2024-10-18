# frozen_string_literal: true

module Categories
  module Admins
    class Destroy
      def call(category)
        category.destroy!
      end
    end
  end
end
