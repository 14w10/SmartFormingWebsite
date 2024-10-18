# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, skip: :all

  namespace :api, defaults: { format: :json } do
    devise_scope :user do
      resource :sessions, controller: 'users/sessions', only: [:create, :show, :destroy]
      resource :passwords, controller: 'users/passwords', only: [:create, :edit, :update]
    end

    namespace :admin do
      namespace :forms do
        resources :builders, only: [:create, :show, :update]
      end

      resources :admins, only: [:index, :create, :show]
      resources :editors, only: [:index, :create, :show]
      resources :categories
      resources :computation_modules, only: [:index, :create, :show, :update, :destroy] do
        post 'copy', on: :member
      end
      resources :computation_request_results, only: [:show]
      resources :computation_results, only: [:show, :update]
      resources :computation_requests, only: [:index, :show, :update]
      resources :portfolio_modules, only: [:index, :create, :show, :update]
      resources :portfolio_requests, only: [:index, :show, :update]
      resources :signups, only: [:index, :show, :update]
      resources :users, only: [:index, :show]
    end

    namespace :forms do
      resources :validations, only: [:create]
    end

    namespace :orders do
      resources :computation_requests, only: [:index, :show]
      resources :computation_results, only: [:show]
      resources :portfolio_requests, only: [:index, :show]
      resources :portfolio_computation_requests, only: [:show]
    end

    namespace :store do
      resources :categories, only: [:index, :show]
      resources :computation_forms, only: [:show]
      resources :computation_modules, only: [:index, :show] do
        member do
          resources :portfolio_modules, only: :index, controller: 'computation_modules/portfolio_modules'
        end
      end


      resources :computation_requests, only: [:create, :show]
      resources :portfolio_modules, only: [:index, :show] do
        resources :portfolio_requests, only: [:create]
      end

      resources :portfolio_computation_requests, only: [:create]
    end

    namespace :uploads do
      unless Rails.env.test?
        mount Shrine.presign_endpoint(:cache) => '/presign'
      end
    end

    resources :computation_modules, only: [:index, :create, :show, :update]

    resources :portfolio_modules, only: [:index, :create, :show, :update] do
      resources :portfolio_requests, only: [:index, :create]
    end
    
    resources :signups, only: [:create]
    resources :step_validations, path: 'signups/step_validations',
              controller: 'signups/step_validations', only: [:create]
    resources :confirmations, path: 'signups/confirmations',
              controller: 'signups/confirmations', only: [:create]
  end

  get 'reset-password/:reset_password_token',
      to: 'api/users/passwords#update', as: 'reset_password'
  get 'sign-in', to: 'api/signups#create', as: 'sign_in'
  get 'sign-up', to: 'api/users/sessions#create', as: 'sign_up'
  get 'confirmation/:token', to: 'api/signups/confirmations#create', as: 'confirmation'
end
