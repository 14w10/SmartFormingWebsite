class AddDeclineReasonToComputationRequests < ActiveRecord::Migration[5.2]
  def up
    add_column :computation_requests, :decline_reason, :text
  end

  def down
    remove_column :computation_requests, :decline_reason
  end
end
