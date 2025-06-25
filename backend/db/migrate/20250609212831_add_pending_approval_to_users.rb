class AddPendingApprovalToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :pending_approval, :boolean
  end
end
