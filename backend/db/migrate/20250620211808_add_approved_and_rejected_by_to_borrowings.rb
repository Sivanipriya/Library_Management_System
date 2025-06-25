class AddApprovedAndRejectedByToBorrowings < ActiveRecord::Migration[8.0]
  def change
    add_column :borrowings, :approved_by_id, :integer
    add_column :borrowings, :rejected_by_id, :integer
  end
end
