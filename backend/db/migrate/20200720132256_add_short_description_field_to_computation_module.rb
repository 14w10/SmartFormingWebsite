class AddShortDescriptionFieldToComputationModule < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :short_description, :text, default: ''
  end
end
