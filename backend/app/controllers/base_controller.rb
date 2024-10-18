# frozen_string_literal: true

class BaseController < ApplicationController
  include Concerns::ErrorsHandler
  include Concerns::Api::Paginable
  include Concerns::Api::Authorazible

  respond_to :json, :csv

  protected

  def handle_route_not_found
    render_json_error('Route not found', :not_found)
  end

  def handle_not_found
    render_json_error('Not found', :not_found)
  end

  def handle_invalid_record_error(error)
    render_json_error(error.message, :unprocessable_entity)
  end

  def handle_unauthorized
    render nothing: true, status: :unauthorized
  end

  def handle_forbidden
    render nothing: true, status: :forbidden
  end

  def handle_unverified_request
    render nothing: true, status: :forbidden
  end

  def order_params
    {
      params.fetch(:sort, 'id').underscore => params.fetch(:order, 'desc')
    }
  end

  def meta(records_per_page)
    {
      totalPages: records_per_page.total_pages,
      totalCount: records_per_page.total_count
    }
  end
end
