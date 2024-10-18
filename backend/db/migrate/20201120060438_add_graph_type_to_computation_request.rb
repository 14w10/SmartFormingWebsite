class AddGraphTypeToComputationRequest < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_requests, :graph_type, :string
  end
end
