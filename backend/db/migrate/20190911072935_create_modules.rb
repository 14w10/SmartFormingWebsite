class CreateModules < ActiveRecord::Migration[5.2]
  def up
    create_table :computation_modules do |t|
      t.bigint :author_id, null: false
      t.string :title, null: false, default: ''
      t.text :description, null: false, default: ''
      t.jsonb :meta, null: false, default: {}
      t.string :status
      t.datetime :approved_at
      t.datetime :rejected_at
      t.datetime :review_started_at
      t.datetime :published_at
      t.timestamps null: false
    end

    add_index :computation_modules, :author_id
    add_index :computation_modules, :title, unique: true

    add_foreign_key :computation_modules, :users, column: :author_id
  end

  def down
    drop_table :computation_modules
  end
end
