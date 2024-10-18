class CreatePortfolioRequest < ActiveRecord::Migration[5.2]
  def up
    create_table :portfolio_requests do |t|
      t.bigint :portfolio_module_id
      t.bigint :author_id
      t.string :status
      t.jsonb :meta, null: false, default: {}
      t.text :decline_reason
      t.datetime :approved_at
      t.datetime :declined_at
      t.timestamps null: false
    end

    add_index :portfolio_requests, :author_id
    add_index :portfolio_requests, :portfolio_module_id

    add_foreign_key :portfolio_requests, :portfolio_modules
    add_foreign_key :portfolio_requests, :users, column: :author_id
  end

  def down
    drop_table :portfolio_requests
  end
end
