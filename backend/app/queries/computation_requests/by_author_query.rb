# frozen_string_literal: true

module ComputationRequests
  class ByAuthorQuery
    def call(author_id)
      ComputationRequest.where(author_id: author_id)
    end
  end
end
