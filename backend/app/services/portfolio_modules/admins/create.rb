# frozen_string_literal: true

module PortfolioModules
  module Admins
    class Create
      include AutoInject[
        create_mailer: 'mailers.coauthors.create_mailer'
      ]
  
      def call(params)
        portfolio_module = PortfolioModule.create!(params)
        portfolio_module.published
        portfolio_module.touch(:published_at)
        portfolio_module.save
        
        portfolio_module.coauthors.each do |coauthor|
          create_mailer.(coauthor).deliver_later
        end

        portfolio_module
      end
    end
  end
end
