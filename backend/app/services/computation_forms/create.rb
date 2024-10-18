# frozen_string_literal: true

module ComputationForms
  class Create
    def call(computation_module, params, steps, files)
      if computation_module.computation_form.nil?
        computation_module.create_computation_form(
          meta: { steps: steps, files: files },
          files_block_enabled: params[:files_block_enabled]
        )
      end
      computation_module.computation_form
    end
  end
end
