# frozen_string_literal: true

module Concerns
  module Predicates
    extend ActiveSupport::Concern

    module Validations
      include Dry::Logic::Predicates

      predicate(:title_size?) do |title|
        title.size <= TITLE_MAX_SIZE
      end

      predicate(:module_uid_size?) do |uid|
        uid.size <= MODULE_UID_MAX_SIZE
      end

      predicate(:user_exists?) do |id|
        User.find_by(id: id).present?
      end

      predicate(:email?) do |value|
        ::Devise.email_regexp.match(value)
      end

      predicate(:name?) do |value|
        /^[a-zA-Z\s]+$/.match(value)
      end

      predicate(:link?) do |_value|
        true
      end

      predicate(:present?) do |value|
        !value.blank?
      end

      predicate(:data_module?) do |value|
        value.to_s == 'data_module'
      end

      predicate(:functional_module?) do |value|
        value.to_s == 'functional_module'
      end

    end

    included do
      predicates(Validations)
    end
  end
end
