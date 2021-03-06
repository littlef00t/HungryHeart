class SessionsController < ApplicationController
  before_action :require_no_user!, only: [:new, :create]
  def new
  end

  def create
    user = User.find_by_credentials(
      params[:user][:username],
      params[:user][:password]
    )

    if user.nil?
      flash.now[:errors] = ["Incorrect username and/or password"]
      render :new
    else
      sign_in(user)
      redirect_to :root
    end
  end

  def show
    if current_user
      @current_user = current_user
      render :show
    else
      @current_user = User.new(id: -1)
      render :show
    end

  end

  def destroy
    sign_out
    render json: {}
  end

end
