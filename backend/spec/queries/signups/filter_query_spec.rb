# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::FilterQuery do
  describe '#call' do
    let(:service) { described_class.new }
    let(:result)  { service.(filter_params) }

    before do
      create(:signup)
      create(:signup, :approved)
      create(:signup, :declined)
    end

    context 'status' do
      let(:filter_params) do
        {
          status: :approved
        }
      end

      it 'returns collection' do
        expect(result.sample.status).to eq('approved')
      end
    end
  end
end
