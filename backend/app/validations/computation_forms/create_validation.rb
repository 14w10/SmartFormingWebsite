# frozen_string_literal: true

module ComputationForms
  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def computation_form_exists?(id)
        !ComputationModule.find(id).computation_form.present?
      end

      def computation_module_approved?(id)
        ComputationModule.find(id).approved?
      end
    end

    required(:computation_module_id).filled(
      :int?,
      :computation_form_exists?,
      :computation_module_approved?
    )
    required(:steps).each do
      required(:'$id').filled(:str?)
      required(:'$schema').filled(:str?)
      required(:type).filled(:str?)
      required(:title).filled(:str?)
      required(:description).filled(:str?)
      required(:required).filled
      required(:properties).filled
    end

    optional(:files).each do
      required(:label).filled(:str?)
      optional(:description).maybe(:str?)
      required(:field_name).filled(:str?)
    end
  end
end
