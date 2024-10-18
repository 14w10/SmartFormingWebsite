# frozen_string_literal: true

class PortfolioComputationModuleSerializer < ApplicationSerializer
  #set_type :portfolio_computation_module

  attributes :sort_index

  belongs_to :computation_module, serializer: ComputationModuleSerializer
end
