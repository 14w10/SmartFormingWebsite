class AddRoleToUsers < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :role, :integer, null: false, index: true, default: 20
    change_column_null :users, :signup_id, true
    remove_foreign_key :users, :signups
  end

  def down
    remove_column :users, :role
    change_column_null :users, :signup_id, false
    add_foreign_key :users, :signups
  end
end
