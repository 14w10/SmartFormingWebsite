# frozen_string_literal: true

module Api
  module Admin
    module Forms
      class BuildersController < Api::Admin::BaseController
        include Concerns::Api::ComputationFormable
        include AutoInject[
          create_computation_form: 'services.computation_forms.create',
          create_form_validation: 'validations.computation_forms.create_validation',
          update_computation_form: 'services.computation_forms.update',
          update_form_validation: 'validations.computation_forms.update_validation'
        ]

        def create
          if true#create_validation.success?
            created_computation_form = create_computation_form.(
              computation_module, form_params, steps_params, files_params
            )
            render json: { data: computation_form_data(created_computation_form) }, status: :created
          else
            render_json_errors(create_validation.errors, :unprocessable_entity)
          end
        end

        def show
          render json: { data: computation_form_data(computation_form) }
        end

        def update
          if true#update_validation.success?
            updated_computation_form = update_computation_form.(
              computation_form, form_params, steps_params, files_params
            )
            render json: { data: computation_form_data(updated_computation_form) }
          else
            render_json_errors(update_validation.errors, :unprocessable_entity)
          end
        end

        private

        def form_params
          params.require(:form).slice(
            :computation_module_id,
            :files_block_enabled,
            :files,
            :steps
          ).to_unsafe_h
        end

        def steps_params
          form_params[:steps]
        end

        def files_params
          form_params[:files]
        end

        def computation_module
          @computation_module ||= ComputationModule.find(computation_module_id)
        end

        def computation_module_id
          form_params[:computation_module_id]
        end

        def computation_form
          @computation_form ||= ComputationForm.find(params[:id])
        end

        def create_validation
          create_form_validation.(form_params)
        end

        def update_validation
          update_form_validation.(
            form_params.merge(computation_module_id: computation_form.computation_module.id)
          )
        end
      end
    end
  end
end
