# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationRequests::CreateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
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
        files: [
          {
            'label': 'label',
            'description': 'description',
            'fileName': 'fileNamea'
          }
        ],
        schemas: [{}],
        files_schemas: [{}],
        attachments_attributes: [
          {
            label: 'label',
            field_name: 'field_name',
            file_type: 'computation_request_data',
            file: {
              id: 'test.id'
            }
          }
        ]
      }
    end
    let(:author) { create(:user) }
    let(:computation_form) { create(:computation_form) }

    context 'invalid' do
      context 'author_id' do
        let(:author) { double('author', id: 0) }

        it 'returns errors' do
          expect_validation_error_for(:author_id)
        end
      end

      context 'computation_form_id' do
        let(:computation_form) do
          double('computation_form', id: 0, meta: { steps: [{}], files: [{}] })
        end

        it 'returns errors' do
          expect_validation_error_for(:computation_form_id)
        end
      end
    end

    context 'valid' do
      it 'returns success' do
        expect(validation.success?).to be
      end
    end
  end
end
