# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::ByAuthorQuery do
  describe '#call' do
    let(:computation_module1) { create(:computation_module) }
    let(:computation_module2) { create(:computation_module) }
    let(:query) { described_class.new }
    let(:result) { query.(computation_module1.author.id) }

    it 'filters by author' do
      expect(result).to include(computation_module1)
      expect(result).not_to include(computation_module2)
    end
  end
end
