class AddReturnApprovedToBorrowings < ActiveRecord::Migration[8.0]
  def change
    add_column :borrowings, :return_approved, :boolean
  end
end
