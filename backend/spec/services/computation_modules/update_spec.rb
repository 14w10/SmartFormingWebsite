# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::Update do
  describe '#call' do
    let!(:computation_module) { create(:computation_module) }
    let(:params) do
      {
        title: 'updated_title'
      }
    end
    let(:service) { described_class.new }
    let(:result) { service.(computation_module, params) }

    it 'creates signup' do
      expect(result.title).to eq('updated_title')
    end
  end
end
