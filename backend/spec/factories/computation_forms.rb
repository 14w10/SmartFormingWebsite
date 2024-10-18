# frozen_string_literal: true

FactoryBot.define do
  factory :computation_form, class: 'ComputationForm' do
    meta do
      {
        steps: [
          {
            '$id': '12313',
            '$schema': 'http://json-schema.org/draft-07/schema#',
            'type': 'object',
            'title': 'Step 1',
            'description': 'form description',
            'required': [
              'firstName',
              'lastName',
              'age'
            ],
            'properties': {
              'firstName': {
                'default': 'Vasia',
                'description': 'First name.',
                'minLength': 1,
                'type': 'string'
              },
              'lastName': {
                'description': 'Last name.',
                'minLength': 1,
                'type': 'string'
              }
            }
          }
        ],
        files: [
          {
            'label': 'label',
            'description': 'description',
            'fieldName': 'fieldName'
          }
        ]
      }
    end

    before(:create) do |record|
      record.computation_module = create(:computation_module, :approved)
    end
  end
end
