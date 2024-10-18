class CreatePortfolioComputationModules < ActiveRecord::Migration[5.2]
  def change
    create_table :portfolio_computation_modules do |t|
      t.references :portfolio_module, foreign_key: true, null: false
      t.references :computation_module, foreign_key: true, null: false
      t.integer :sort_index
    end
  end
end
