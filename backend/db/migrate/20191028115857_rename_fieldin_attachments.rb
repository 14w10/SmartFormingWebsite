class RenameFieldinAttachments < ActiveRecord::Migration[5.2]
  def up
    rename_column :attachments, :file_name, :field_name
  end

  def down
    rename_column :attachments, :field_name, :file_name
  end
end
