class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :name
      t.string :description
      t.string :author
      t.boolean :available

      t.timestamps
    end
  end
end
