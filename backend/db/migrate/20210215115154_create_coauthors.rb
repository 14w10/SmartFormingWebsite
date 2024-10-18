class CreateCoauthors < ActiveRecord::Migration[5.2]
  def change
    create_table :coauthors do |t|
      t.references :portfolio_module, foreign_key: true, null: false
      t.string  :firstname
      t.string  :lastname
      t.string  :degree
      t.string  :institution
      t.string  :region
      t.string  :orcid
      t.string  :email
      t.boolean :main, default: false
      t.integer :product_contribution
      t.jsonb   :research_areas

      t.timestamps
    end
  end
end
