class AddSessionTokenToUser < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :session_token, :string
    add_index :users, :session_token, unique: true
  end

  def down
    remove_column :users, :session_token
  end
end
