class CreateComputationForm < ActiveRecord::Migration[5.2]
  def up
    create_table :computation_forms do |t|
      t.bigint :computation_module_id, index: true, unique: true
      t.jsonb :meta
      t.timestamps
    end

    add_foreign_key :computation_forms, :computation_modules
  end

  def down
    drop_table :computation_forms
  end
end
