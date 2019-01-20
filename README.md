# 概要

Vue + Rails の習作。

はてなブックマークのデータをインポートして表示することが出来る。  
対応しているのは`RSS1.0形式`のデータ。  
http://b.hatena.ne.jp/-/my/config/data_management

# 開発

`postgresql`が入っていない場合はまずそれを入れて動かす。

```
$ brew install postgresql
$ brew services start postgresql
```

ライブラリのインストールとデータベースの準備を行う。

```
$ yarn
$ bundle
$ bin/rails db:create
$ bin/rails db:migrate
$ bin/rails db:seed
```

Rails と webpack-dev-server を起動して`localhost:3000`にアクセスする。

```
$ yarn start
$ bin/rails s
$ open http://localhost:3000
```

`name: user1`、`password: pass`というユーザーが作成されているので、ログインする。  
ヘッダーにある「インポート」ボタンで`./sample.rss`を読み込むとデータが作成される。
