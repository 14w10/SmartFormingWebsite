# frozen_string_literal: true

class CreateSignups < ActiveRecord::Migration[5.2]
  def up
    create_table :signups do |t|
      t.integer :title,                    null: false, default: 0
      t.string :first_name,                null: false, default: ''
      t.string :last_name,                 null: false, default: ''
      t.string :phone_number,              null: false, default: ''
      t.string :email,                     null: false, default: ''
      t.string :password,                  null: false, default: ''

      t.string :position
      t.string :role

      t.string :organization_name,         null: false, default: ''
      t.string :organization_address,      null: false, default: ''
      t.string :organization_postcode,     null: false, default: ''
      t.string :organization_country,      null: false, default: ''
      t.string :organization_business

      t.string :website
      t.string :linkedin
      t.string :research_gate
      t.string :other_link

      t.string :sf_id
      t.string :status

      t.timestamps null: false
    end

    add_index :signups, :email
  end

  def down
    drop_table :signups
  end
end
