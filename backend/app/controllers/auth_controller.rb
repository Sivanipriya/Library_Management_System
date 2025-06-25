class AuthController < ApplicationController
 

  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      unless user.active
        return render json: { error: "Your account is deactivated. Please contact admin." }, status: :forbidden
      end
      if user.role == "librarian" && user.pending_approval
      render json: { error: "Your librarian account is pending admin approval." }, status: :forbidden
      else
        exp = 24.hours.from_now.to_i
        token = JWT.encode({ user_id: user.id, exp: exp }, Rails.application.secret_key_base)
        render json: { token: token, user: user }
      end
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
