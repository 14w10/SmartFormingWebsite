class CreateComputationResults < ActiveRecord::Migration[5.2]
  def change
    create_table :computation_results do |t|
      t.string :typ
      t.string :x
      t.string :y
      t.string :z
      t.json :data, default: {}
      t.references :computation_request, foreign_key: true

      t.timestamps
    end
  end
end
