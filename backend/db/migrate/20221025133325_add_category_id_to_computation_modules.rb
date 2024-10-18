class AddCategoryIdToComputationModules < ActiveRecord::Migration[5.2]
  def up
    add_reference :computation_modules, :category, foreign_key: true, index: true

    Rake::Task['computation_modules:create_and_set_default_category'].invoke

    change_column_null :computation_modules, :category_id, false
  end

  def down 
    remove_reference :computation_modules, :category 
  end 
end
