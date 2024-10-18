class CreateComputationRequest < ActiveRecord::Migration[5.2]
  def up
    create_table :computation_requests do |t|
      t.bigint :computation_form_id
      t.bigint :author_id
      t.string :status
      t.jsonb :meta, null: false, default: {}
      t.datetime :processed_at
      t.datetime :finished_at
      t.datetime :declined_at
      t.timestamps null: false
    end

    add_index :computation_requests, :computation_form_id
    add_index :computation_requests, :author_id

    add_foreign_key :computation_requests, :users, column: :author_id
    add_foreign_key :computation_requests, :computation_forms
  end

  def down
    drop_table :computation_requests
  end
end
