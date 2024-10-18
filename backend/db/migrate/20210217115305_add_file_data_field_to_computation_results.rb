class AddFileDataFieldToComputationResults < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_results, :file_data, :jsonb
  end
end
