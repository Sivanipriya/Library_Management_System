class ChangeDefaultAvailableInBooks < ActiveRecord::Migration[7.0]
  def change
    change_column_default :books, :available, from: nil, to: true
  end
end