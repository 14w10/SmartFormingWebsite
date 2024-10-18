# frozen_string_literal: true

module ComputationModules
  module Admins
    CreateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        def title_uniq?(value)
          !ComputationModule.where(title: value).exists?
        end
      end

      required(:title).filled(:str?, :title_uniq?, :title_size?, :present?)
      required(:description).filled(:str?, :present?)
      required(:category_id).filled(:int?, :present?)
      required(:author_id).filled(:int?, :user_exists?)
      required(:attachments_attributes).each do
        required(:file_type).filled
        required(:file).filled
      end
    end
  end
end
