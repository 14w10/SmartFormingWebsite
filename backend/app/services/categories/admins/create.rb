# frozen_string_literal: true

module Categories
  module Admins
    class Create
      def call(params)
        Category.create!(params)
      end
    end
  end
end
