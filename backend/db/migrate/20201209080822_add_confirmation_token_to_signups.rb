class AddConfirmationTokenToSignups < ActiveRecord::Migration[5.2]
  def change
    add_column :signups, :confirmation_token, :string
    add_column :signups, :confirmation_sent_at, :datetime
    add_index :signups, :confirmation_token, unique: true
  end
end
