# frozen_string_literal: true

module Api
  class PortfolioModulesController < Api::BaseController
    include AutoInject[
      create_module_validation: 'validations.portfolio_modules.create_validation',
      create_module: 'services.portfolio_modules.create',
      filter: 'queries.portfolio_modules.filter',
      update_module_validation: 'validations.portfolio_modules.update_validation',
      update_module: 'services.portfolio_modules.update',
      serializer: 'serializers.portfolio_module'
    ]

    def index
      render json: serializer.new(
        portfolio_modules_per_page, meta: meta(portfolio_modules_per_page), include: include
      ).serialized_json, status: :ok
    end

    def create
      if create_validation.success?
        record = create_module.(portfolio_module_params)
        render json: serializer.new(
          record, include: include
        ).serialized_json, status: :created
      else
        render_json_errors(create_validation.errors, :unprocessable_entity)
      end
    end

    def show
      render json: serializer.new(
        portfolio_module, include: include
      ).serialized_json, status: :ok
    end

    def update
      if update_validation.success?
        record = update_module.(
          portfolio_module, portfolio_module_params.except(:author_id)
        )
        render json: serializer.new(
          record, include: include
        ).serialized_json, status: :ok
      else
        render_json_errors(update_validation.errors, :unprocessable_entity)
      end
    end

    private

    def prepare_portfolio_cm_attributes                 
      cm = params[:portfolio_module].delete(:computation_modules)
      return if cm.blank?
      
      attributes = (cm[:pre_fe] + cm[:post_fe]).compact.uniq.each_with_index.inject([]) do |all, (id, index)|
        all << {
          computation_module_id: id, sort_index: index
        }
      end
      
      params[:portfolio_module].merge!(portfolio_computation_modules_attributes: attributes)
    end

    def portfolio_module_params
      prepare_portfolio_cm_attributes
      
      params.require(:portfolio_module).permit(
        :author_id,
        :description,
        :title,
        portfolio_computation_modules_attributes: [
          :computation_module_id,
          :sort_index
        ],
        keywords: [],
        coauthors_attributes: [
          :portfolio_module_id,
          :firstname,
          :lastname,
          :degree,
          :institution,
          :region,
          :orcid,
          :email,
          :main,
          :product_contribution,
          research_areas: []
        ],
        cover: [
          :id, 
          :storage, 
          metadata: [
            :filename, 
            :size, 
            :mime_type,
            crop: [
              :x,
              :y,
              :width,
              :height
            ]
          ]
        ]
    ).to_h
    end

    def filter_params
      params.slice(
        :search,
        :status
      ).to_unsafe_h
    end

    def portfolio_module
      @portfolio_module ||= portfolio_modules_query(current_user.id).find(params[:id])
    end

    def portfolio_modules
      @portfolio_modules ||=
        filter.(filter_params, portfolio_modules_query(current_user.id))
    end

    def portfolio_modules_per_page
      @portfolio_modules_per_page ||=
        paginate(portfolio_modules.order(order_params)).preload(*include)
    end

    def include
      [
        :author,
        :coauthors,
        :computation_modules
      ]
    end

    def create_validation
      create_module_validation.(portfolio_module_params)
    end

    def update_validation
      update_module_validation.(portfolio_module_params)
    end

    def portfolio_modules_query(author_id)
      PortfolioModule.where(author_id: author_id)
    end
  end
end
