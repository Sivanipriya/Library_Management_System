class UpdateBooksFields < ActiveRecord::Migration[7.0]
  def change
    add_column :books, :genre, :string
    add_column :books, :publication_date, :date

    remove_column :books, :name, :string
    remove_column :books, :description, :text
  end
end