class AddDeclineReasonToSignups < ActiveRecord::Migration[5.2]
  def up
    add_column :signups, :decline_reason, :text
  end

  def down
    remove_column :signups, :decline_reason
  end
end
