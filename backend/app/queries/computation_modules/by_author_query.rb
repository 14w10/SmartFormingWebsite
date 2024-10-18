# frozen_string_literal: true

module ComputationModules
  class ByAuthorQuery
    def call(author_id)
      ComputationModule.where(author_id: author_id)
    end
  end
end
