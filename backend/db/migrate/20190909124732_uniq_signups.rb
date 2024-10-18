class UniqSignups < ActiveRecord::Migration[5.2]
  def up
    add_index :signups, [:email, :status], unique: true
  end

  def down
    remove_index :signups, name: 'index_signups_on_email_and_status'
  end
end
