class AddOnMainPageToComputationModules < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :on_main_page, :boolean, default: false
  end
end
