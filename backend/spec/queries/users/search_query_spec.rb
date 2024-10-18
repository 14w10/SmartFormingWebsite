# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::SearchQuery do
  let(:query) { described_class.new }

  it 'finds users by first name' do
    record = create(:user, first_name: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds users by last_name' do
    record = create(:user, last_name: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds users by email' do
    user = create(:user, email: 'foo@foo.foo')
    expect(query.('foo@foo.foo')).to match_array [user]
  end

  it 'returns default scope if query string is blank' do
    expect(query.('').to_sql).to eq User.all.to_sql
  end
end
