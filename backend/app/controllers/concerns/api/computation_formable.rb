# frozen_string_literal: true

module Concerns
  module Api
    module ComputationFormable
      def computation_form_data(form)
        {
          id: form.id,
          type: 'computationForm',
          attributes: {
            computationModuleId: form.computation_module.id,
            filesBlockEnabled: form.files_block_enabled,
            computationFormId: form.id,
            steps: meta_collection(form.meta.fetch('steps', [])),
            files: meta_collection(form.meta.fetch('files', []))
          }
        }
      end

      def meta_collection(collection)
        collection.each do |item|
          item.deep_transform_keys! do |key|
            key.camelize(:lower)
          end
        end
      end
    end
  end
end
