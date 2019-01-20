class Api::V1::SessionsController < ApplicationController
  skip_before_action :login_required

  def create
    req = JSON.parse(request.body.read)
    user = User.find_by(name: req['name'])

    if user&.authenticate(req['password'])
      session[:user_id] = user.id
      render json: {result: 'success login.'}
    else
      render json: {message: '認証に失敗しました。'}, status: 401
    end
  end

  def destroy
    reset_session
    render json: {result: 'success logout.'}
  end

end
