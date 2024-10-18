# frozen_string_literal: true

class User < ApplicationRecord
  include Concerns::SessionInvalidatable

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable

  enum role: {
    admin: 0,
    editor: 10,
    user: 20
  }

  belongs_to :signup, optional: true

  has_many :computation_modules, foreign_key: :author_id, dependent: :destroy
  has_many :computation_requests, foreign_key: :author_id, dependent: :destroy
  has_many :portfolio_modules, foreign_key: :author_id, dependent: :destroy
  has_many :portfolio_requests, foreign_key: :author_id, dependent: :destroy
end
