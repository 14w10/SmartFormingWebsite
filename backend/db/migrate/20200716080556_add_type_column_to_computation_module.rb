class AddTypeColumnToComputationModule < ActiveRecord::Migration[5.2]
  def up
    add_column :computation_modules, :module_type, :integer
    
    execute <<~SQL
    UPDATE computation_modules
    SET module_type = 0
    WHERE 1=1;
    SQL
  end

  def down
    remove_column :computation_modules, :module_type
  end
end
