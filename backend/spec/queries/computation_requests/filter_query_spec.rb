# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::FilterQuery do
  describe '#call' do
    let(:service) { described_class.new }
    let(:result)  { service.(filter_params) }

    before do
      create(:computation_request)
      create(:computation_request, :declined)
    end

    context 'status' do
      let(:filter_params) do
        {
          status: :new
        }
      end

      it 'returns collection' do
        expect(result.any?).to be
      end
    end

    context 'status' do
      let(:filter_params) do
        {
          status: :declined
        }
      end

      it 'returns collection' do
        expect(result.sample.status).to eq('declined')
      end
    end
  end
end
