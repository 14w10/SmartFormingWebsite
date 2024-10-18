class CreateCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :categories do |t|
      t.column :name, :string, null: false, unique: true 
      t.column :icon_data, :jsonb

      t.timestamps
    end
  end
end
