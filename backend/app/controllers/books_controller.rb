class BooksController < ApplicationController
  
  before_action :authorize_request
  before_action :authorize_admin_or_librarian, only: [:create, :update, :destroy]
  
  def index
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10

    books = Book.all
    if params[:genre].present?
      books = books.where(genre: params[:genre])
    end

    if params[:search].present?
      q = "%#{params[:search].downcase}%"
      books = books.where("LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?", q, q, q)
    end

    total = books.count
    books = books.order(Arel.sql("CASE WHEN quantity > 0 THEN 0 ELSE 1 END, title"))
               .offset((page - 1) * per_page)
               .limit(per_page)

 
 render json: {
  books: books.map do |book|
    book.as_json(only: [:id, :title, :author, :genre, :publication_date, :quantity,:returned,:returned_at, :return_approved, :return_rejected]).merge({
      image_url: book.image.attached? ? url_for(book.image) : nil
    })
  end,
  total: total
}

  end
  def show
    book = Book.find(params[:id])
    render json: book
  end

  def create
    book = Book.new(book_params)
    if book.save
      render json: book, status: :created
    else
      render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    book = Book.find(params[:id])
    if book.update(book_params)
      render json: book
    else
      render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    book = Book.find(params[:id])
    if book.destroy
      render json: { message: "Book deleted successfully." }
    else
      render json: { error: book.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end
    

  def available_count
    count=Book.where("quantity > 0").count
    render json: { available_count: count }
  end
  def genres
    genres = Book.distinct.pluck(:genre)
    render json: { genres: genres }
  end


  private

  def book_params
    params.require(:book).permit(:title, :author, :genre, :publication_date,  :quantity,:image)
  end
  
end 
