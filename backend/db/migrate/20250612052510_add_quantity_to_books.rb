class AddQuantityToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :quantity, :integer,default:1
  end
end
