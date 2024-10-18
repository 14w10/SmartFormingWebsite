# frozen_string_literal: true

require 'spec_helper'

RSpec.describe ComputationModule, type: :model do
  describe 'associations' do
    it { should have_many(:datasets).dependent(:destroy) }
  end

  describe 'validations' do
    it do
      should define_enum_for(:module_type).with_values(['pre-fe', 'post-fe'])
    end

    it do
      should define_enum_for(:module_content_type).with_values([:functional_module, :data_module])
    end
  end
end
