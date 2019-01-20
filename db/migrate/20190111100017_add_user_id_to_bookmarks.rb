class AddUserIdToBookmarks < ActiveRecord::Migration[5.2]
  def up
    execute 'DELETE FROM bookmarks ;'
    add_reference :bookmarks, :user, null: false, index: true
  end
  def down
    remove_reference :bookmarks, :user, index: true
  end
end
