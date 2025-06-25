class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book
  
  belongs_to :approved_by, class_name: "User", optional: true
  belongs_to :rejected_by, class_name: "User", optional: true

end
