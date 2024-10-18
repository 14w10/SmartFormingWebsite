class CreatePortfolioModule < ActiveRecord::Migration[5.2]
  def up
    create_table :portfolio_modules do |t|
      t.bigint :author_id, null: false
      t.string :title, null: false, default: ''
      t.text :description, null: false, default: ''
      t.text :reject_reason, null: false, default: ''
      t.jsonb :meta, null: false, default: {}
      t.string :status
      t.datetime :approved_at
      t.datetime :rejected_at
      t.datetime :review_started_at
      t.datetime :published_at
      t.timestamps null: false
    end

    add_index :portfolio_modules, :author_id
    add_index :portfolio_modules, :title, unique: true

    add_foreign_key :portfolio_modules, :users, column: :author_id,
                    unique: true, where: "status != 'declined'"
  end

  def down
    drop_table :portfolio_modules
  end
end
