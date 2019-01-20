class ApplicationController < ActionController::Base
  before_action :login_required

  private

  def current_user
    current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def login_required
    render json: {message: 'ログインしてください。'}, status: 401 unless current_user
  end

end
