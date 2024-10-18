class AddCoverAndKeywordsFieldsToPortfolio < ActiveRecord::Migration[5.2]
  def change
    add_column :portfolio_modules, :cover_data, :jsonb
    add_column :portfolio_modules, :keywords, :jsonb, default: []
  end
end
