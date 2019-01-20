class CreateBookmarks < ActiveRecord::Migration[5.2]
  def change
    create_table :bookmarks do |t|
      t.string :title
      t.string :url, null: false
      t.text :comment

      t.timestamps
      t.index :url, unique: true
    end
  end
end
