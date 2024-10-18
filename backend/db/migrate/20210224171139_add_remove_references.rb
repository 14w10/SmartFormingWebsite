class AddRemoveReferences < ActiveRecord::Migration[5.2]
  def up
    add_reference :computation_results, :base_request, foreign_key: true, index: true

    execute <<~SQL
    UPDATE computation_results
    SET base_request_id = computation_request_id
    WHERE 1=1;
    SQL

    remove_reference(:computation_results, :computation_request, index: true)
  end

  def down
    add_reference :computation_results, :computation_request

    execute <<~SQL
    UPDATE computation_results
    SET computation_request_id = base_request_id
    WHERE 1=1;
    SQL

    remove_reference(:computation_results, :base_request, index: true, foreign_key: true)
  end
end
