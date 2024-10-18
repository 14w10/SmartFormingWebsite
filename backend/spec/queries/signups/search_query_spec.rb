# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Signups::SearchQuery do
  let(:query) { described_class.new }

  it 'finds signup by first name' do
    record = create(:signup, first_name: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds signup by last_name' do
    record = create(:signup, last_name: 'foo')
    expect(query.('foo')).to match_array [record]
  end

  it 'finds signup by email' do
    user = create(:signup, email: 'foo@foo.foo')
    expect(query.('foo@foo.foo')).to match_array [user]
  end

  it 'returns default scope if query string is blank' do
    expect(query.('').to_sql).to eq Signup.all.to_sql
  end
end
