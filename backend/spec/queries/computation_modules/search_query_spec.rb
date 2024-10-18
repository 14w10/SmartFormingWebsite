# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::SearchQuery do
  let(:query) { described_class.new }

  it 'finds computation module by title' do
    record = create(:computation_module, title: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds computation module by uid' do
    record = create(:computation_module, uid: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds computation module by keywords' do
    record = create(:computation_module, keywords: ['foo', 'bar'])
    expect(query.('bar')).to match_array [record]
  end

  it 'returns default scope if query string is blank' do
    expect(query.('').to_sql).to eq ComputationModule.all.to_sql
  end
end
