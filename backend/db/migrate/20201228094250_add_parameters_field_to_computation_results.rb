class AddParametersFieldToComputationResults < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_results, :parameters, :jsonb, default: []
  end
end
