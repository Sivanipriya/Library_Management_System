class AddRolesToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :role, :string
    # migration file
  end
end
