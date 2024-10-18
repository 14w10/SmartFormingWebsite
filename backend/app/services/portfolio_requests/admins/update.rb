# frozen_string_literal: true

module PortfolioRequests
  module Admins
    class Update
      def call(record, params)
        status = params.delete(:status).try(:underscore)

        ActiveRecord::Base.transaction do
          case status
          when 'approved'
            record.approved!
            record.touch(:approved_at)
          when 'declined'
            record.declined!
            record.touch(:declined_at)
          end

          record.update(params)
          record
        end
      end
    end
  end
end
