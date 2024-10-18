# frozen_string_literal: true

Rails.configuration.container = Dry::Container.new

Rails.configuration.container.namespace(:mailers) do
  namespace(:signups) do
    register :approve_mailer, -> { Signups::ApproveMailer }
    register :confirm_mailer, -> { Signups::ConfirmMailer }
    register :decline_mailer, -> { Signups::DeclineMailer }
  end
  
  namespace(:coauthors) do
    register :create_mailer, -> { Coauthors::CreateMailer }
  end
end

Rails.configuration.container.namespace(:queries) do
  namespace(:computation_forms) do
    register :by_author, -> { ComputationForms::ByAuthorQuery.new }
  end

  namespace(:computation_modules) do
    register :by_author, -> { ComputationModules::ByAuthorQuery.new }
    register :filter, -> { ComputationModules::FilterQuery.new }
    register :search, -> { ComputationModules::SearchQuery.new }
  end

  namespace(:computation_requests) do
    register :by_author, -> { ComputationRequests::ByAuthorQuery.new }
    register :filter, -> { ComputationRequests::FilterQuery.new }
    register :search, -> { ComputationRequests::SearchQuery.new }
  end

  namespace(:portfolio_modules) do
    register :filter, -> { PortfolioModules::FilterQuery.new }
    register :search, -> { PortfolioModules::SearchQuery.new }
  end

  namespace(:portfolio_requests) do
    register :filter, -> { PortfolioRequests::FilterQuery.new }
    register :search, -> { PortfolioRequests::SearchQuery.new }
  end

  namespace(:signups) do
    register :filter, -> { Signups::FilterQuery.new }
    register :search, -> { Signups::SearchQuery.new }
  end

  namespace(:users) do
    register :filter, -> { Users::FilterQuery.new }
    register :search, -> { Users::SearchQuery.new }
  end
end

Rails.configuration.container.namespace(:serializers) do
  namespace(:store) do
    register :computation_module, -> { Store::ComputationModuleSerializer }
    register :portfolio_module, -> { Store::PortfolioModuleSerializer }
    register :portfolio_request, -> { Store::PortfolioRequestSerializer }
  end

  register :admin, -> { AdminSerializer }
  register :attachment, -> { AttachmentSerializer }
  register :dataset, -> { DatasetSerializer }
  register :category, -> { CategorySerializer }
  register :computation_module, -> { ComputationModuleSerializer }
  register :computation_module_result, -> { ComputationModuleResultSerializer }
  register :computation_request, -> { ComputationRequestSerializer }
  register :computation_request_result, -> { ComputationRequestResultSerializer }
  register :computation_result, -> { ComputationResultSerializer }
  register :editor, -> { EditorSerializer }
  register :portfolio_module, -> { PortfolioModuleSerializer }
  register :portfolio_request, -> { PortfolioRequestSerializer }
  register :signup, -> { SignupSerializer }
  register :user, -> { UserSerializer }
end

Rails.configuration.container.namespace(:services) do
  namespace(:base_requests) do
    register :process_data, -> { BaseRequests::ProcessData.new }
  end

  namespace(:categories) do
    namespace(:admins) do
      register :create, -> { Categories::Admins::Create.new }
      register :update, -> { Categories::Admins::Update.new }
      register :destroy, -> { Categories::Admins::Destroy.new }

    end
  end

  namespace(:computation_forms) do
    register :create, -> { ComputationForms::Create.new }
    register :update, -> { ComputationForms::Update.new }
  end

  namespace(:computation_modules) do
    register :create, -> { ComputationModules::Create.new }
    register :update, -> { ComputationModules::Update.new }

    namespace(:admins) do
      register :create, -> { ComputationModules::Admins::Create.new }
      register :update, -> { ComputationModules::Admins::Update.new }
      register :destroy, -> { ComputationModules::Admins::Destroy.new }
    end
  end

  namespace(:computation_requests) do
    register :create, -> { ComputationRequests::Create.new }

    namespace(:admins) do
      register :file, -> { ComputationRequests::Admins::File.new }
      register :update, -> { ComputationRequests::Admins::Update.new }
    end
  end

  namespace(:computation_results) do
    namespace(:admins) do
      register :update, -> { ComputationResults::Admins::Update.new }
    end
  end

  namespace(:portfolio_modules) do
    register :create, -> { PortfolioModules::Create.new }
    register :update, -> { PortfolioModules::Update.new }

    namespace(:admins) do
      register :create, -> { PortfolioModules::Admins::Create.new }
      register :update, -> { PortfolioModules::Admins::Update.new }
    end
  end

  namespace(:portfolio_requests) do
    register :create, -> { PortfolioRequests::Create.new }

    namespace(:admins) do
      register :update, -> { PortfolioRequests::Admins::Update.new }
    end
  end

  namespace(:portfolio_computation_requests) do
    register :create, -> { PortfolioComputationRequests::Create.new }
    register :prepared_params, -> { PortfolioComputationRequests::PreparedParams.new }
  end

  namespace(:signups) do
    register :create, -> { Signups::Create.new }
    register :update, -> { Signups::Update.new }

    namespace(:passwords) do
      register :encrypt, -> { Signups::Passwords::Encrypt.new }
      register :decrypt, -> { Signups::Passwords::Decrypt.new }
    end
  end

  namespace(:users) do
    register :register, -> { Users::Register.new }

    namespace(:admins) do
      register :create, -> { Users::Admins::Create.new }
    end

    namespace(:editors) do
      register :create, -> { Users::Editors::Create.new }
    end
  end

  register :json_validator, -> { JsonValidator }
  register :json_schema_validator, -> { JsonSchemaValidator }
  register :steps_validator, -> { StepsValidator.new }
end


Rails.configuration.container.namespace(:validations) do

  namespace(:categories) do
    namespace(:admins) do
      register :create_validation, -> { Categories::Admins::CreateValidation }
      register :update_validation, -> { Categories::Admins::UpdateValidation }
    end
  end

  namespace(:computation_forms) do
    register :create_validation, -> { ComputationForms::CreateValidation }
    register :update_validation, -> { ComputationForms::UpdateValidation }
    register :step_validation, -> { ComputationForms::StepValidation }
  end

  namespace(:computation_modules) do
    register :create_validation, -> { ComputationModules::CreateValidation }
    register :update_validation, -> { ComputationModules::UpdateValidation }

    namespace(:admins) do
      register :create_validation, -> { ComputationModules::Admins::CreateValidation }
      register :update_validation, -> { ComputationModules::Admins::UpdateValidation }
    end
  end

  namespace(:computation_requests) do
    register :create_validation, -> { ComputationRequests::CreateValidation }

    namespace(:admins) do
      register :update_validation, -> { ComputationRequests::Admins::UpdateValidation }
    end
  end

  namespace(:computation_results) do
    namespace(:admins) do
      register :update_validation, -> { ComputationResults::Admins::UpdateValidation }
    end
  end

  namespace(:portfolio_modules) do
    register :create_validation, -> { PortfolioModules::CreateValidation }
    register :update_validation, -> { PortfolioModules::UpdateValidation }

    namespace(:admins) do
      register :create_validation, -> { PortfolioModules::Admins::CreateValidation }
      register :update_validation, -> { PortfolioModules::Admins::UpdateValidation }
    end
  end

  namespace(:portfolio_requests) do
    register :create_validation, -> { PortfolioRequests::CreateValidation }
    register :update_validation, -> { PortfolioRequests::UpdateValidation }
  end

  namespace(:signups) do
    register :create_validation, -> { Signups::CreateValidation }
    register :confirm_validation, -> { Signups::ConfirmValidation }
    register :step_validation, -> { Signups::StepValidation }
    register :update_validation, -> { Signups::UpdateValidation }
  end

  namespace(:users) do
    namespace(:admins) do
      register :create_validation, -> { Users::Admins::CreateValidation}
    end

    namespace(:editors) do
      register :create_validation, -> { Users::Editors::CreateValidation }
    end
  end
end

AutoInject = Dry::AutoInject(Rails.configuration.container)
