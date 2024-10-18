# frozen_string_literal: true

module Concerns
  module Api
    module Paginable
      def paginate(collection)
        collection
          .page(params.fetch(:page, 1))
          .per(params.fetch(:per, Kaminari.config.default_per_page))
      end
    end
  end
end
