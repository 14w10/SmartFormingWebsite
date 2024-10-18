# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::Create do
  describe '#call' do
    let!(:computation_form) { create(:computation_form) }
    let!(:author) { create(:user) }
    let(:service) { described_class.new }
    let(:result) { service.(computation_form, params) }
    let(:params) do
      {
        author_id: author.id,
        computation_form_id: computation_form.id,
        steps: [
          {
            'lastName': '12',
            'firstName': 'asd',
            'age': 19
          }
        ],
        attachment_attributes:
          {
            label: 'label',
            field_name: 'field_name',
            file_type: 'computation_request_data',
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
      }
    end

    it 'creates computation_request' do
      expect(result).to be_kind_of(ComputationRequest)
      expect(result.persisted?).to be
    end
  end
end
