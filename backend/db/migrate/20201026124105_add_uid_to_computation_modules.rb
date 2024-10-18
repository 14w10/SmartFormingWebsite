class AddUidToComputationModules < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :uid, :string
    add_index :computation_modules, :uid, unique: true
  end
end
