# frozen_string_literal: true

module DryValidationsHelper
  extend ActiveSupport::Concern

  def expect_validation_error_for(field, nested = nil)
    if nested
      expect_nested(field, nested)
    else
      expect_plain(field)
    end
  end

  private

  def expect_plain(field)
    expect(validation.errors[field]).to be
    expect(validation.success?).not_to be
  end

  def expect_nested(field, nested)
    expect(validation.errors[field][nested]).to be
    expect(validation.success?).not_to be
  end
end
