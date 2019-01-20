class Tag < ApplicationRecord
  validates :name, presence: true

  belongs_to :user

  has_many :bookmark_tags
  has_many :bookmarks, through: :bookmark_tags
end
