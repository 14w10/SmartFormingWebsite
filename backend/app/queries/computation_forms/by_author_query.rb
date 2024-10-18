# frozen_string_literal: true

module ComputationForms
  class ByAuthorQuery
    def call(author_id)
      ComputationForm
        .joins(:computation_module)
        .where(computation_modules: { author_id: author_id })
    end
  end
end
