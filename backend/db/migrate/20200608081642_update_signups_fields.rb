class UpdateSignupsFields < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
    UPDATE signups
    SET organization_business = 'other'
    WHERE organization_business != 'academic'
    OR organization_business != 'industrial'
    OR organization_business != 'other';
    SQL

    change_column_default :signups, :organization_business, ''
  end

  def down
    change_column_default :signups, :organization_business, nil
  end
end
