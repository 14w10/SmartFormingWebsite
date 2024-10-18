class AddTypeFieldToComputationRequest < ActiveRecord::Migration[5.2]
  def up
    rename_table :computation_requests, :base_requests
    add_column :base_requests, :type, :string
    add_reference :base_requests, :portfolio_request, foreign_key: true, null: true

    execute <<~SQL
    UPDATE base_requests
    SET type = 'ComputationRequest'
    WHERE 1=1;
    SQL
    
    execute <<~SQL
    UPDATE attachments
    SET attachable_type = 'BaseRequest'
    WHERE attachable_type='ComputationRequest';
    SQL
  end

  def down
    execute <<~SQL
    UPDATE attachments
    SET attachable_type = 'ComputationRequest'
    WHERE attachable_type='BaseRequest';
    SQL

    remove_reference(:base_requests, :portfolio_request, index: true, foreign_key: true)

    rename_table :base_requests, :computation_requests
    remove_column :computation_requests, :type
  end
end
