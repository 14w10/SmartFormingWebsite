# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ComputationModules::Admins::CreateValidation do
  describe '#call' do
    let(:validation) { described_class.(params) }
    let(:params) do
      {
        title: title,
        description: description,
        author_id: author.id,
        category_id: category.id,
        module_content_type: module_content_type,
        attachments_attributes: attachments_attributes
      }
    end
    let(:attachments_attributes) do
      [
        {
          file_type: 'verificationReport',
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
    end
    let(:title) { 'title' }
    let(:module_content_type) { 'functional_module' }
    let(:description) { 'description' }
    let(:author) { create(:user) }
    let(:category) { create(:category) }


    context 'invalid' do
      context 'title' do
        let(:title) { 'title' * 100 }

        it 'returns errors' do
          expect_validation_error_for(:title)
        end
      end

      context 'description' do
        let(:description) { nil }

        it 'returns errors' do
          expect_validation_error_for(:description)
        end
      end

      context 'author_id' do
        let(:author) { double('author', id: 0) }

        it 'returns errors' do
          expect_validation_error_for(:author_id)
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
