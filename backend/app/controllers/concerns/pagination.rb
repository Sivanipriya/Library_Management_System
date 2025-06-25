# app/controllers/concerns/paginatable.rb
module Paginatable
  extend ActiveSupport::Concern

  def pagination_params
    {
      page: (params[:page] || 1).to_i.clamp(1, 10_000),
      per_page: (params[:per_page] || 10).to_i.clamp(1, 100)
    }
  end

  def paginate(scope)
    page = pagination_params[:page]
    per_page = pagination_params[:per_page]
    scope.offset((page - 1) * per_page).limit(per_page)
  end

  def render_paginated(scope, serializer: nil)
    total = scope.count
    paginated = paginate(scope)

    render json: {
      total: total,
      page: pagination_params[:page],
      per_page: pagination_params[:per_page],
      data: serializer ? paginated.map(&serializer) : paginated
    }
  end
end
