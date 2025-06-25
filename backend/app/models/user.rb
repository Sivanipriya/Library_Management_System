class User < ApplicationRecord
  has_secure_password
  has_many :borrowings
  has_many :borrowed_books, through: :borrowings, source: :book

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  enum :role, { member: "member", librarian: "librarian", admin: "admin" }
end
