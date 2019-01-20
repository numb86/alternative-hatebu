Rails.application.routes.draw do
  root to: 'top_page#index'
  get '/tag/*other', to: 'top_page#index'
  get '/login', to: 'top_page#index'

  namespace :api, format: 'json' do
    namespace :v1 do
      get '/bookmarks/count', to: 'bookmarks#index'
      get '/bookmarks', to: 'bookmarks#show'
      post '/bookmarks/import', to: 'bookmarks#import'
      get '/tags', to: 'tags#index'
      post '/login', to: 'sessions#create'
      post '/logout', to: 'sessions#destroy'
    end
  end

end
