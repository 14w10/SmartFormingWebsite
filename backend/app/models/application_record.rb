# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  include Concerns::DryErrors

  self.abstract_class = true
end
