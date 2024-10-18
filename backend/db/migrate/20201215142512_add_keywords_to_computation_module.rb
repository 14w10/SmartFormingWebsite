class AddKeywordsToComputationModule < ActiveRecord::Migration[5.2]
  def change
    add_column :computation_modules, :keywords, :jsonb, default: []
  end
end
