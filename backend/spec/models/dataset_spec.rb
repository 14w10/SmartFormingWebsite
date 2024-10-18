# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Dataset, type: :model do
  describe 'associations' do
    it { should belong_to(:computation_module) }
  end

  describe 'validations' do
    it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0.01) }
  end
end
