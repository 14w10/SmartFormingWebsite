# frozen_string_literal: true

class CoauthorSerializer < ApplicationSerializer
  set_type :coauthor

  attributes :id,
             :firstname,
             :lastname,
             :degree,
             :institution,
             :region,
             :orcid,
             :email,
             :main,
             :product_contribution,
             :research_areas
end