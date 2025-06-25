class ApplicationController < ActionController::API
  private

  def authorize_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header
    decoded = decode_token(token)
    @current_user = User.find_by(id: decoded["user_id"]) if decoded
  rescue
    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def authroize_destroy
    unless @current_user&.admin? 
      render json: { error: "Access denied" }, status: :unauthorized
    end
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base)[0]
  rescue
    nil
  end

  def authorize_admin_or_librarian
    unless @current_user&.admin? || @current_user&.librarian?
      render json: { error: "Access denied" }, status: :unauthorized
    end
  end
  
end
