FactoryBot.define do
  factory :computation_result do
    typ { "custom" }
    x { "MyString" }
    y { "MyString" }
    z { "MyString" }
    data { {} }
    base_request
  end
end
