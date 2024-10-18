class AddCoverDataToComputationModule < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :cover_data, :jsonb#, null: false
  end
end
