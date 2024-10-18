# frozen_string_literal: true

module ComputationRequests
  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def computation_form_exists?(id)
        ComputationForm.find_by(id: id).present?
      end
    end

    required(:author_id).filled(:int?, :user_exists?)
    required(:computation_form_id).filled(
      :int?,
      :computation_form_exists?
    )
    required(:steps).filled
    required(:schemas).filled

    optional(:files_schemas)
    optional(:attachment_attributes).each do
      required(:label).filled
      optional(:description).maybe
      required(:field_name).filled
      required(:file_type).filled
      required(:file).filled
    end

    validate(steps: [:steps, :schemas]) do |steps, schemas|
      steps.size == schemas.size
    end

    validate(computation_request_files: [:attachment_attribute, :files_schemas]) do |ats, schemas|
      ats.size == schemas.size
    end
  end
end
