class RemoveWrongPasswordColumnsFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :password, :string
    remove_column :users, :password_digest, :string
  end
end
