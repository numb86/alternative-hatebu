class AddUserIdToTags < ActiveRecord::Migration[5.2]
  def up
    execute 'DELETE FROM users ;'
    execute 'DELETE FROM bookmarks ;'
    execute 'DELETE FROM tags ;'
    add_reference :tags, :user, null: false, index: true
  end
  def down
    remove_reference :tags, :user, index: true
  end
end
