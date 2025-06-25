class RemoveAvailableFromBooks < ActiveRecord::Migration[8.0]
  def change
    remove_column :books, :available, :boolean
  end
end
