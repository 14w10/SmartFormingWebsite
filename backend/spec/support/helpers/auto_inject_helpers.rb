# frozen_string_literal: true

module AutoInjectHelpers
  extend ActiveSupport::Concern

  def expect_call_instance_of(klass)
    expect_any_instance_of(klass).to(receive(:call))
  end
end
