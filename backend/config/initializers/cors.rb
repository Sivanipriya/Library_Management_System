Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # 👈 or use 'http://localhost:5173' for stricter setup

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']
  end
end
