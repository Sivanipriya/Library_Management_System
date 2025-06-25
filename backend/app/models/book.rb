# app/models/book.rb
class Book < ApplicationRecord
  validates :quantity,numericality: {greater_than_or_equal_to:0}
  has_many :borrowings, dependent: :restrict_with_error
  validates :title, :author, :genre, :publication_date, presence: true
  has_one_attached :image
end
