class UserMailer < ApplicationMailer
  def return_approved
    @user = params[:user]
    @book = params[:book]
    mail(
      to: @user.email,
      subject: "Your return request for '#{@book.title}' was approved"
    )
  end

  def return_rejected
    @user = params[:user]
    @book = params[:book]
    mail(
      to: @user.email,
      subject: "Your return request for '#{@book.title}' was rejected"
    )
  end
end