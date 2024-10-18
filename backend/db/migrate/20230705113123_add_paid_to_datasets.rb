class AddPaidToDatasets < ActiveRecord::Migration[5.2]
  def change
    add_column :datasets, :paid, :boolean, null: false, default: true
  end
end
