# frozen_string_literal: true

module ComputationForms
  StepValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def computation_form_exists?(id)
        ComputationForm.find(id).present?
      end
    end

    required(:step_id).filled(:int?)
    required(:computation_form_id).filled(:computation_form_exists?)
    required(:step).filled
  end
end
