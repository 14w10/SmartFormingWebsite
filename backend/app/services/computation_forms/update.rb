# frozen_string_literal: true

module ComputationForms
  class Update
    def call(computation_form, params, steps, files)
      computation_form.update(
        meta: { steps: steps, files: files },
        files_block_enabled: params[:files_block_enabled]
      )
      computation_form
    end
  end
end
