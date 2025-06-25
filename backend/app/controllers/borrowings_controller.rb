class BorrowingsController < ApplicationController
  before_action :authorize_request
  before_action :authorize_admin_or_librarian

  skip_before_action :authorize_admin_or_librarian, only: [:create, :return_book, :my_borrowings]

  def index
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10

    # Start query with joins + includes
    borrowings = Borrowing.joins(:book)
                          .includes(:user, :book, :approved_by, :rejected_by)
                          .references(:book)

    # Search filter
    if params[:search].present?
      q = "%#{params[:search].downcase}%"
      borrowings = borrowings.where(
        "LOWER(books.title) LIKE ? OR LOWER(books.author) LIKE ? OR LOWER(books.genre) LIKE ?",
        q, q, q
      )
    end

    # Returned filter
    if params[:returned].present?
      borrowings = borrowings.where(returned: ActiveModel::Type::Boolean.new.cast(params[:returned]))
    end

    # Return approved filter
    if params[:return_approved].present?
      borrowings = borrowings.where(return_approved: ActiveModel::Type::Boolean.new.cast(params[:return_approved]))
    end

    # Return rejected filter
    if params[:return_rejected].present?
      borrowings = borrowings.where(return_rejected: ActiveModel::Type::Boolean.new.cast(params[:return_rejected]))
    end

    total = borrowings.count

    borrowings = borrowings.order(created_at: :desc)
                           .offset((page - 1) * per_page)
                           .limit(per_page)

    render json: {
      borrowings: borrowings.as_json(
        only: [:id, :created_at, :returned, :returned_at,:return_approved, :return_rejected],
        include: {
          user: { only: [:id, :email,:name,:active] },
          book: { only: [:id, :title] },
          approved_by: { only: [:id, :email,:name] },
          rejected_by: { only: [:id, :email,:name] }
        }
      ),
      total: total
    }
  end

  def create
    book = Book.find_by(id: params[:id])
    return render json: { error: "Book not found" }, status: :not_found unless book

    existing_borrowing = Borrowing.find_by(book: book, user: @current_user, returned: false)
    if existing_borrowing
      return render json: { error: "You already borrowed this book and have not returned it yet." }, status: :unprocessable_entity
    end

    active_borrow_count = Borrowing.where(user: @current_user, returned: false).count
    if active_borrow_count >= 5
      return render json: { error: "You cannot borrow more than 5 books at a time." }, status: :forbidden
    end

    if book.quantity <= 0
      return render json: { error: "Book not available" }, status: :unprocessable_entity
    end

    borrowing = Borrowing.new(user: @current_user, book: book, returned: false)
    if borrowing.save
      book.update(quantity: book.quantity - 1)
      render json: { message: "Book borrowed successfully", borrowed: borrowing }, status: :created
    else
      render json: { error: borrowing.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def reject_return
    borrowing = Borrowing.find(params[:id])
    if borrowing.returned && !borrowing.return_approved
      # Send rejection email

      borrowing.update(returned: false, return_approved: false, return_rejected: true, rejected_by_id: @current_user.id)
      UserMailer.with(user: borrowing.user, book: borrowing.book).return_rejected.deliver_later
      render json: { message: "Return rejected and user notified." }
    else
      render json: { error: "Already approved or not pending." }, status: :unprocessable_entity
    end
  end

  def return_book
    book = Book.find_by(id: params[:id])
    return render json: { error: "Book not found" }, status: :not_found unless book

    borrowing = Borrowing.find_by(book: book, user: @current_user, returned: false)
    return render json: { error: "No active borrowing found" }, status: :not_found unless borrowing

    borrowing.update(returned: true, returned_at: Time.current, return_approved: false)
    render json: { message: "Book return requested. Awaiting librarian approval." }, status: :ok
  end


  def approve_return
    borrowing = Borrowing.find(params[:id])
    unless @current_user&.role.in?(["admin", "librarian"])
      return render json: { error: "Unauthorized" }, status: :unauthorized
    end
    if borrowing.returned && !borrowing.return_approved
     
      borrowing.update(return_approved: true, approved_by_id: @current_user.id)
      borrowing.book.update(quantity: borrowing.book.quantity + 1)

      UserMailer.with(user: borrowing.user, book: borrowing.book).return_approved.deliver_later
      render json: { message: "Return approved.User notified" }
    else
      render json: { error: "Already approved or not returned." }, status: :unprocessable_entity
    end
  end
  def my_borrowings
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10
    tab = params[:tab] || "borrow"

    borrowings = @current_user.borrowings.includes(:book)

    # Search
    if params[:search].present?
      q = "%#{params[:search].downcase}%"
      borrowings = borrowings.joins(:book).where(
        "LOWER(books.title) LIKE ? OR LOWER(books.author) LIKE ? OR LOWER(books.genre) LIKE ?", q, q, q
      )
    end

    # Tab filter
    case tab
    when "return"
      borrowings = borrowings.where(returned: false)
    when "pending"
      borrowings = borrowings.where(returned: true, return_approved: false)
    when "history"
      borrowings = borrowings.where(returned: true, return_approved: true)
    end

    total = borrowings.count

    borrowings = borrowings
      .order(:returned, returned_at: :desc)
      .offset((page - 1) * per_page)
      .limit(per_page)

    render json: {
      borrowings: borrowings.as_json(
        include: { 
          book: { only: [:id, :title, :author, :genre, :publication_date, :quantity,:returned, :returned_at, :return_approved] },
          approved_by: { only: [:id, :email, :name] },
          rejected_by: { only: [:id, :email, :name] }
        }
      ),
      total: total
    }
  end

end
