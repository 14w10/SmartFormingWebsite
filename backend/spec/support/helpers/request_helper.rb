# frozen_string_literal: true

module RequestHelper
  def json
    @json ||= JSON.parse(response.body)
  end
end
