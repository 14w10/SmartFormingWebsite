# frozen_string_literal: true

module ComputationModules
  module Types
    include Dry::Types.module
    Typs = Types::Strict::String.enum(::ComputationModule.module_types)
    ContentTyps = Types::Strict::String.enum(::ComputationModule.module_content_types)
  end

  CreateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      def title_uniq?(value)
        !ComputationModule.where(title: value).exists?
      end
    end

    required(:title).filled(:str?, :title_uniq?, :title_size?, :present?)
    required(:module_type).filled(Types::Typs)
    required(:module_content_type).filled(Types::ContentTyps)
    required(:category_id).filled(:int?, :present?)
    required(:short_description).filled(:str?, :present?)
    required(:description).filled(:str?, :present?)
    required(:author_id).filled(:int?, :user_exists?)
    optional(:attachments_attributes).filled(:array?).each do
      required(:file_type).filled
      required(:file).filled
    end

    optional(:datasets_attributes).filled(:array?).each do
      required(:file_type).filled
      required(:file).filled
      optional(:paid).filled(:bool?)
    end

    rule(dataset_attributes_required?: [:module_content_type, :dataset_attributes]) do |module_content_type, dataset_attributes|
      module_content_type.data_module?.then(dataset_attributes.filled?)
    end

    rule(attachments_attributes_required?: [:module_content_type, :attachments_attributes]) do |module_content_type, attachments_attributes|
      module_content_type.functional_module?.then(attachments_attributes.filled?)
    end
  end
end
