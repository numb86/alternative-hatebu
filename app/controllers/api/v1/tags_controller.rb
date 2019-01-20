class Api::V1::TagsController < ApplicationController
  def index
    name_list = current_user.tags.map { |tag| tag.name }
    render json: {result: name_list}
  end
end
