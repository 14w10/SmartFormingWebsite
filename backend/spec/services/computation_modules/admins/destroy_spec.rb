# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::Admins::Destroy do
  describe '#call' do
    let!(:computation_module) { create(:computation_module) }
    let(:service) { described_class.new }
    subject(:result) { service.(computation_module) }

    it 'removes an computation module' do
      expect { result }.to change { ComputationModule.count }.from(1).to(0)
    end
  end
end
