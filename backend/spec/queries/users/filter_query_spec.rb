# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::FilterQuery do
  describe '#call' do
    let(:user)    { create(:user) }
    let(:service) { described_class.new }
    let(:result)  { service.(filter_params, User.user) }

    before do
      create(:user, :editor)
      create(:user, :admin)
    end

    context 'status' do
      let(:filter_params) do
        {
          search: user.first_name
        }
      end

      it 'returns collection' do
        expect(result.sample.first_name).to eq(user.first_name)
      end
    end
  end
end
