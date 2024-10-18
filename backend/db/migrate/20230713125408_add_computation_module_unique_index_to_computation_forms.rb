class AddComputationModuleUniqueIndexToComputationForms < ActiveRecord::Migration[5.2]
  def up
    remove_index :computation_forms, :computation_module_id  
    add_index :computation_forms, :computation_module_id, unique: true
  end

  def down
    remove_index :computation_forms, :computation_module_id  
    add_index :computation_forms, :computation_module_id
  end
end
