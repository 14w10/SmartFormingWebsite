class RemoveApprovedAtFromPortfolioModules < ActiveRecord::Migration[5.2]
  def up
    remove_column :portfolio_modules, :approved_at
  end

  def down
    add_column :portfolio_modules, :approved_at, :datetime
  end
end
