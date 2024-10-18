class AddModuleContentTypeToComputationModules < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :module_content_type, :integer, default: 0
  end
end
