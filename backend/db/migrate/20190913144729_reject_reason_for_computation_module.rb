class RejectReasonForComputationModule < ActiveRecord::Migration[5.2]
  def up
    add_column :computation_modules, :reject_reason, :text
  end

  def down
    remove_column :computation_modules, :reject_reason
  end
end
