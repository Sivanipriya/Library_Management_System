Rails.application.routes.draw do
  post "/login", to: "auth#login"
  post "/signup", to: "users#create"

  get "/users", to: "users#index"
  resources :users, only: [:index, :create, :destroy]

  # Make sure custom route comes BEFORE books resources
  get "/books/genres", to: "books#genres"
  get "/available_count", to: "books#available_count"
  resources :books
  get "/my_borrowings", to: "borrowings#my_borrowings"


  resources :borrowings do
    member do
      post :approve_return
      post :reject_return
    end
    collection do
      get :my_borrowings
    end
  end

  post "/return", to: "borrowings#return_book"
  get '/admin/dashboard_stats', to: 'users#dashboard_stats'

  post 'users/:id/deactivate', to: 'users#deactivate'
  post 'users/:id/reactivate', to: 'users#reactivate'


  get "/pending_librarians", to: "users#pending_librarians"
  post "/approve_librarian", to: "users#approve_librarian"

  get "up" => "rails/health#show", as: :rails_health_check
end
