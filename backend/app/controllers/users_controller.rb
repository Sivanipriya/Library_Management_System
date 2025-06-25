class UsersController < ApplicationController
  before_action :authorize_request, only: [:dashboard_stats, :deactivate, :reactivate, :approve_librarian, :destroy]

  def index
    role = params[:role]
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10

    users = User.all
    users = users.where(role: role) if role.present?
    users = users.where("email LIKE ?", "%#{params[:search]}%") if params[:search].present? # <-- add this line
    total = users.count
    users = users.offset((page - 1) * per_page).limit(per_page)
    render json: { users: users.as_json(only: [:id, :email, :role, :pending_approval, :name, :active]), total: total }
  end
  def create
    user = User.new(user_params)
    if user.role == "librarian"
      user.pending_approval = true
    else
      user.pending_approval = false
    end
    user.role ||= "member"
    if user.save
      exp = 24.hours.from_now.to_i
      token = JWT.encode({user_id: user.id, exp: exp }, Rails.application.secret_key_base)
      render json: { token: token, user: user.as_json(only: [:id, :email, :role, :pending_approval,:name]) }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  def pending_librarians
    render json: User.where(role: "librarian", pending_approval: true)
  end

  def approve_librarian
    user = User.find(params[:id])
    if user.role =="librarian"
      user.update(pending_approval: false)
      render json: { message: "Librarian approved" }
    else
      render json: { error: "Not a librarian" }, status: :unprocessable_entity
    end
  end
  def destroy
    user = User.find(params[:id])

    if Borrowing.where(user_id: user.id, returned: false).exists?
      return render json: { error: "Cannot delete user: user has active borrowings." }, status: :unprocessable_entity
    end

    user.destroy
    render json: { message: "User deleted successfully." }
  end
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role, :name)
  end
  def deactivate
    user = User.find(params[:id])

    if user.role != "librarian"
      return render json: { error: "Deactivation is allowed only for librarians." }, status: :forbidden
    end

    user.update!(active: false)
    render json: { message: "Librarian deactivated successfully." }
  end

  

  def reactivate
    user = User.find(params[:id])
    user.update!(active: true)
    render json: { message: "User reactivated" }
  end
  def dashboard_stats
    unless @current_user&.role.in?(["admin", "librarian"])
      return render json: { error: "Unauthorized" }, status: :unauthorized
    end

    render json: {
      totalBooks: Book.count,
      totalUsers: User.count,
      totalBorrowings: Borrowing.count,
      pendingReturns: Borrowing.where(returned: false).count
    }
  end



end
