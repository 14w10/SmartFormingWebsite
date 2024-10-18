class PartialIndexForSignups < ActiveRecord::Migration[5.2]
  def up
    remove_index :signups, name: 'index_signups_on_email_and_status'
  end

  def down
    add_index :signups, [:email, :status], unique: true, where: "status != 'declined'"
  end
end
