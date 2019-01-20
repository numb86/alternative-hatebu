class Api::V1::BookmarksController < ApplicationController
  ITEM_AMOUNT_PER_PAGE = 10.0

  def index
    render json: {result: current_user.bookmarks.count}
  end

  def show
    page = bookmark_params[:page].to_i
    target_bookmark = current_user.bookmarks

    no_hit_response = {
      displayList: [],
      totalNumber: 0,
      page: {
        total: 1,
        current: page
      },
    }

    # タグによる絞り込みを行う
    if bookmark_params[:tags]
      target_tag_ids = []
      bookmark_params[:tags].split(',').each do |tag|
        id = current_user.tags.where(name: tag).first&.id

        # 該当するタグがなかった場合はその時点でヒット件数0が確定する
        if id == nil
          render json: no_hit_response
          return;
        end

        target_tag_ids << id
      end
      if  target_tag_ids.count > 0
        target_bookmark = target_bookmark.search_by_tags(target_tag_ids)
      end
    end

    # キーワード検索を行う
    if bookmark_params[:q]
      keywords = bookmark_params[:q].sub('　', ' ').split(' ')
      target_bookmark = target_bookmark.search_by_keywords(keywords)
    end

    item_amount = target_bookmark.count
    response = {
      displayList: target_bookmark.recent.extract_display_list(page, ITEM_AMOUNT_PER_PAGE).convert_to_api_response,
      totalNumber: item_amount,
      page: {
        total: item_amount === 0 ? 1 : (item_amount / ITEM_AMOUNT_PER_PAGE).ceil,
        current: page
      },
    }
    render json: response
  end

  def import
    begin
      bookmark_list = JSON.parse(request.body.read)['bookmarkList']

      Bookmark.transaction do
        bookmark_list.map do |b|
          if current_user.bookmarks.exists?(url: b['url'])
            update(b, current_user.bookmarks.where(url: b['url']).first)
          else
            create(b)
          end
        end
      end

      render json: {result: 'success'}
    rescue
      render json: {message: 'インポートに失敗しました。'}, status: 400
    end
  end

  private

  def bookmark_params
    params.permit(:page, :q, :tags)
  end

  def create(bookmark_hash)
    bookmark = current_user.bookmarks.new(
      title: bookmark_hash['title'],
      url: bookmark_hash['url'],
      comment: bookmark_hash['comment'],
      created_at: bookmark_hash['date'],
      updated_at: bookmark_hash['date'],
    )

    if bookmark_hash['tags'] != nil
      bookmark_hash['tags'].each do |tag_name|
        tag = current_user.tags.find_or_create_by(name: tag_name)
        tag.bookmarks << bookmark
      end
    else
      bookmark.save!
    end

  end

  def update(bookmark_hash, exist_bookmark)
    if bookmark_hash['title'] != exist_bookmark[:title]
      exist_bookmark.update!(title: bookmark_hash['title'])
    end

    if bookmark_hash['comment'] != exist_bookmark[:comment]
      exist_bookmark.update!(comment: bookmark_hash['comment'])
    end

    # TODO: 変更があったときだけ更新するようにする
    new_tags = bookmark_hash['tags'] || []
    exist_bookmark.update!(tags: [])
    new_tags.each do |tag_name|
      tag = current_user.tags.find_or_create_by(name: tag_name)
      tag.bookmarks << exist_bookmark
    end
  end

end
