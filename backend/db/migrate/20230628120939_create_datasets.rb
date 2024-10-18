class CreateDatasets < ActiveRecord::Migration[5.2]
  def change
    create_table :datasets do |t|
      t.jsonb :file_data
      t.references :computation_module, index: true, foreign_key: true
      t.float :price 
      t.timestamps
    end
  end
end
