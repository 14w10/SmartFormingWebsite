FactoryBot.define do
  factory :coauthor do
    firstname { "MyString" }
    lastname { "MyString" }
    degree { "MyString" }
    institution { "MyString" }
    region { "" }
    orcid { "MyString" }
    email { "MyString" }
    product_contribution { 1 }
    research_areas { "" }
  end
end
