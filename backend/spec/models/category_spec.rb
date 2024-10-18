# frozen_string_literal: true

RSpec.describe Category, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:computation_modules) }
  end
end
