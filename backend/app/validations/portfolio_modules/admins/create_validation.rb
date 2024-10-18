# frozen_string_literal: true

module PortfolioModules
  module Admins
    module Types
      include Dry::Types.module
    
      ComputationModuleId = Types::Integer.constructor do |str|
        str ? str.to_i : str
      end
    end

    CreateValidation = Dry::Validation.Params do
      configure do
        include Concerns::ValidationMessages
        include Concerns::Predicates

        def title_uniq?(value)
          !PortfolioModule.where(title: value).exists?
        end

        def computation_module_exists?(value)
          ComputationModule.exists?(value)
        end
      end

      required(:title).filled(:str?, :title_uniq?, :title_size?, :present?)
      required(:description).filled(:str?, :present?)
      required(:author_id).filled(:int?, :user_exists?)

      # required(:portfolio_computation_modules_attributes).each do
      #   #required(:computation_module_id).filled(:str?, :computation_module_exists?)
      #   required(:computation_module_id, Types::ComputationModuleId).filled(:int?, :computation_module_exists?)
      # end
    end
  end
end
