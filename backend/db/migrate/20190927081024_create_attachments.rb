class CreateAttachments < ActiveRecord::Migration[5.2]
  def up
    create_table :attachments do |t|
      t.jsonb :file_data
      t.integer :file_type, null: false, index: true
      t.bigint :attachable_id
      t.string :attachable_type
      t.timestamps
    end

    add_index :attachments, [:attachable_type, :attachable_id]
  end

  def down
    drop_table :attachments
  end
end
