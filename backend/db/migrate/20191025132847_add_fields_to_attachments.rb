class AddFieldsToAttachments < ActiveRecord::Migration[5.2]
  def up
    add_column :attachments, :label, :string
    add_column :attachments, :description, :string
    add_column :attachments, :file_name, :string
  end

  def down
    remove_column :attachments, :label
    remove_column :attachments, :description
    remove_column :attachments, :file_name
  end
end
