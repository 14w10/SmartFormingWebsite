# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationForms::ByAuthorQuery do
  describe '#call' do
    let(:computation_form1) { create(:computation_form) }
    let(:computation_form2) { create(:computation_form) }
    let(:query) { described_class.new }
    let(:result) { query.(computation_form1.computation_module.author.id) }

    it 'filters by author' do
      expect(result).to include(computation_form1)
      expect(result).not_to include(computation_form2)
    end
  end
end
