class Bookmark < ApplicationRecord
  validates :url, presence: true

  belongs_to :user

  has_many :bookmark_tags
  has_many :tags, through: :bookmark_tags

  scope :recent, -> {order(created_at: :desc)}

  def self.extract_display_list(page, item_amount_per_page)
    Bookmark
      .offset(item_amount_per_page * page - item_amount_per_page)
      .limit(item_amount_per_page)
  end

  def self.convert_to_api_response
    Bookmark.all.map do |b|
      {
        title: b.title,
        url: b.url,
        comment: b.comment,
        tags: b.tags.map{|t| t.name},
        date: (b.created_at + 9.hour).strftime('%Y/%m/%d'), # YYYY/MM/DD
      }
    end
  end

  def self.search_by_tags(tag_ids, logical_and=true)
    bookmarks = []
    tag_ids.each do |id|
      bookmarks = bookmarks + Tag.find(id).bookmarks
    end

    if logical_and == true
      # AND検索
      bookmarks = bookmarks.select{ |b| bookmarks.count(b) > tag_ids.count - 1 }.uniq
    end

    # 配列である bookmarks を ActiveRecord::Relation に変換
    # [#<Bookmark>, #<Bookmark>, #<Bookmark>]
    # ↓
    # #<ActiveRecord::Relation [#<Bookmark>, #<Bookmark>]>
    Bookmark.where(id: bookmarks.map{ |bookmark| bookmark.id })
  end

  def self.search_by_keywords(keywords)
    bookmarks = []
    where_clause = 'title like ? or url like ? or comment like ?'
    keywords.each do |k|
      word = "%#{k}%"
      search_result = Bookmark.where(where_clause, word, word, word)
      tag_ids = Tag.where('name like ?', word).map{ |t| t.id }
      search_result = search_result + Bookmark.search_by_tags(tag_ids, false)
      search_result.uniq!
      bookmarks = bookmarks + search_result
    end
    bookmarks = bookmarks.select{ |b| bookmarks.count(b) > keywords.count - 1 }.uniq

    # 配列である bookmarks を ActiveRecord::Relation に変換
    # [#<Bookmark>, #<Bookmark>, #<Bookmark>]
    # ↓
    # #<ActiveRecord::Relation [#<Bookmark>, #<Bookmark>]>
    Bookmark.where(id: bookmarks.map{ |bookmark| bookmark.id })
  end
end
