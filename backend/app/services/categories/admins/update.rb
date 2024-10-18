# frozen_string_literal: true

module Categories
  module Admins
    class Update
      def call(category, params)
        category.update(params)
        category
      end
    end
  end
end
