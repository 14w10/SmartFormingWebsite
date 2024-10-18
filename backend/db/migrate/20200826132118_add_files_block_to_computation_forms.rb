class AddFilesBlockToComputationForms < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_forms, :files_block_enabled, :boolean, default: false
  end
end
