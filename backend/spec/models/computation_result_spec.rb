# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationResult, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:base_request) }
  end
end
