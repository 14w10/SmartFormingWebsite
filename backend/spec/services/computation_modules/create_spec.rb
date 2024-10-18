# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::Create do
  describe '#call' do
    let(:author) { create(:user) }
    let(:category) { create :category }
    let(:params) do
      build(:computation_module).attributes.merge(
        author_id: author.id,
        category_id: category.id,
        attachments_attributes: [
          {
            file_type: 'verification_report',
            file: {
              id: '49f543380aa2086b89148af105f9d214',
              storage: 'cache',
              metadata: {
                size: 874,
                filename: '0.pdf',
                mime_type: 'application/pdf'
              }
            }
          }
        ],
        datasets_attributes: [
          {
            price: 0.01,
            file: {
              id: '49f543380aa2086b89148af105f9d214',
              storage: 'cache',
              metadata: {
                size: 874,
                filename: '0.pdf',
                mime_type: 'application/pdf'
              }
            }
          }
        ]
      )
    end
    let(:service) { described_class.new }
    let(:result) { service.(params) }

    it 'creates computation_module' do
      expect(result).to be_kind_of(ComputationModule)
      expect(result.persisted?).to be
    end
  end
end
