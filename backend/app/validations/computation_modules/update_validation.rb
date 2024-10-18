# frozen_string_literal: true

module ComputationModules
  UpdateValidation = Dry::Validation.Params do
    configure do
      include Concerns::ValidationMessages
      include Concerns::Predicates

      option :record

      def title_uniq?(value)
        !ComputationModule.where.not(id: record&.id).where(title: value).exists?
      end
    end

    optional(:title).maybe(:str?, :title_uniq?, :title_size?, :present?)
    optional(:description).maybe(:str?, :present?)
    optional(:category).maybe(:str?, :present?)
  end
end
