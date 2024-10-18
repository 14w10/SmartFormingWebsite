# frozen_string_literal: true

class PortfolioComputationModule < ApplicationRecord
  belongs_to :portfolio_module
  belongs_to :computation_module
  
  before_create :default_sort
  
  def default_sort
    self.sort_index ||= 0
  end
end
