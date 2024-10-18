# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_07_05_113123) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attachments", force: :cascade do |t|
    t.jsonb "file_data"
    t.integer "file_type", null: false
    t.bigint "attachable_id"
    t.string "attachable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "label"
    t.string "description"
    t.string "field_name"
    t.index ["attachable_type", "attachable_id"], name: "index_attachments_on_attachable_type_and_attachable_id"
    t.index ["file_type"], name: "index_attachments_on_file_type"
  end

  create_table "base_requests", force: :cascade do |t|
    t.bigint "computation_form_id"
    t.bigint "author_id"
    t.string "status"
    t.jsonb "meta", default: {}, null: false
    t.datetime "processed_at"
    t.datetime "finished_at"
    t.datetime "declined_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "decline_reason"
    t.string "graph_type"
    t.string "type"
    t.bigint "portfolio_request_id"
    t.index ["author_id"], name: "index_base_requests_on_author_id"
    t.index ["computation_form_id"], name: "index_base_requests_on_computation_form_id"
    t.index ["portfolio_request_id"], name: "index_base_requests_on_portfolio_request_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "icon_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "coauthors", force: :cascade do |t|
    t.bigint "portfolio_module_id", null: false
    t.string "firstname"
    t.string "lastname"
    t.string "degree"
    t.string "institution"
    t.string "region"
    t.string "orcid"
    t.string "email"
    t.boolean "main", default: false
    t.integer "product_contribution"
    t.jsonb "research_areas"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["portfolio_module_id"], name: "index_coauthors_on_portfolio_module_id"
  end

  create_table "computation_forms", force: :cascade do |t|
    t.bigint "computation_module_id"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "files_block_enabled", default: false
    t.index ["computation_module_id"], name: "index_computation_forms_on_computation_module_id", unique: true
  end

  create_table "computation_modules", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.string "title", default: "", null: false
    t.text "description", default: "", null: false
    t.jsonb "meta", default: {}, null: false
    t.string "status"
    t.datetime "approved_at"
    t.datetime "rejected_at"
    t.datetime "review_started_at"
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "reject_reason"
    t.integer "module_type"
    t.text "short_description", default: ""
    t.string "uid"
    t.jsonb "cover_data"
    t.jsonb "keywords", default: []
    t.bigint "category_id", null: false
    t.boolean "on_main_page", default: false
    t.integer "module_content_type", default: 0
    t.index ["author_id"], name: "index_computation_modules_on_author_id"
    t.index ["category_id"], name: "index_computation_modules_on_category_id"
    t.index ["title"], name: "index_computation_modules_on_title", unique: true
    t.index ["uid"], name: "index_computation_modules_on_uid", unique: true
  end

  create_table "computation_results", force: :cascade do |t|
    t.string "typ"
    t.string "x"
    t.string "y"
    t.string "z"
    t.json "data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "parameters", default: []
    t.jsonb "file_data"
    t.bigint "base_request_id"
    t.index ["base_request_id"], name: "index_computation_results_on_base_request_id"
  end

  create_table "datasets", force: :cascade do |t|
    t.jsonb "file_data"
    t.bigint "computation_module_id"
    t.float "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "paid", default: true, null: false
    t.index ["computation_module_id"], name: "index_datasets_on_computation_module_id"
  end

  create_table "portfolio_computation_modules", force: :cascade do |t|
    t.bigint "portfolio_module_id", null: false
    t.bigint "computation_module_id", null: false
    t.integer "sort_index"
    t.index ["computation_module_id"], name: "index_portfolio_computation_modules_on_computation_module_id"
    t.index ["portfolio_module_id"], name: "index_portfolio_computation_modules_on_portfolio_module_id"
  end

  create_table "portfolio_modules", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.string "title", default: "", null: false
    t.text "description", default: "", null: false
    t.text "reject_reason", default: "", null: false
    t.jsonb "meta", default: {}, null: false
    t.string "status"
    t.datetime "rejected_at"
    t.datetime "review_started_at"
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "cover_data"
    t.jsonb "keywords", default: []
    t.index ["author_id"], name: "index_portfolio_modules_on_author_id"
    t.index ["title"], name: "index_portfolio_modules_on_title", unique: true
  end

  create_table "portfolio_requests", force: :cascade do |t|
    t.bigint "portfolio_module_id"
    t.bigint "author_id"
    t.string "status"
    t.jsonb "meta", default: {}, null: false
    t.text "decline_reason"
    t.datetime "approved_at"
    t.datetime "declined_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_portfolio_requests_on_author_id"
    t.index ["portfolio_module_id"], name: "index_portfolio_requests_on_portfolio_module_id"
  end

  create_table "signups", force: :cascade do |t|
    t.integer "title", default: 0, null: false
    t.string "first_name", default: "", null: false
    t.string "last_name", default: "", null: false
    t.string "phone_number", default: "", null: false
    t.string "email", default: "", null: false
    t.string "password", default: "", null: false
    t.string "position"
    t.string "role"
    t.string "organization_name", default: "", null: false
    t.string "organization_address", default: "", null: false
    t.string "organization_postcode", default: "", null: false
    t.string "organization_country", default: "", null: false
    t.string "organization_business", default: ""
    t.string "website"
    t.string "linkedin"
    t.string "research_gate"
    t.string "other_link"
    t.string "sf_id"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "decline_reason"
    t.string "confirmation_token"
    t.datetime "confirmation_sent_at"
    t.index ["confirmation_token"], name: "index_signups_on_confirmation_token", unique: true
    t.index ["email"], name: "index_signups_on_email"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "authentication_token", limit: 30
    t.string "title", default: "", null: false
    t.string "first_name", default: "", null: false
    t.string "last_name", default: "", null: false
    t.string "phone_number", default: "", null: false
    t.bigint "signup_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 20, null: false
    t.string "session_token"
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
    t.index ["signup_id"], name: "index_users_on_signup_id", unique: true
  end

  add_foreign_key "base_requests", "computation_forms"
  add_foreign_key "base_requests", "portfolio_requests"
  add_foreign_key "base_requests", "users", column: "author_id"
  add_foreign_key "coauthors", "portfolio_modules"
  add_foreign_key "computation_forms", "computation_modules"
  add_foreign_key "computation_modules", "categories"
  add_foreign_key "computation_modules", "users", column: "author_id"
  add_foreign_key "computation_results", "base_requests"
  add_foreign_key "datasets", "computation_modules"
  add_foreign_key "portfolio_computation_modules", "computation_modules"
  add_foreign_key "portfolio_computation_modules", "portfolio_modules"
  add_foreign_key "portfolio_modules", "users", column: "author_id"
  add_foreign_key "portfolio_requests", "portfolio_modules"
  add_foreign_key "portfolio_requests", "users", column: "author_id"
end
