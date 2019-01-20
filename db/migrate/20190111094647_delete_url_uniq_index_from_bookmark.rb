class DeleteUrlUniqIndexFromBookmark < ActiveRecord::Migration[5.2]
  def change
    remove_index :bookmarks, :url
  end
end
