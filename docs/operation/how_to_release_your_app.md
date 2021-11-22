# How to release your app

## 前提

- HTML 及び薄片画像等を静的配信可能な HTTP サーバーはセットアップ済みとする

## ツールインストール

- git
  - [ここ](https://git-scm.com)を参考にアプリのビルドを実行する OS に合わせた方法でインストールする
- Node.js
  - ソースコードをビルドし, 配信可能なHTMLファイルやJavaScriptファイルを生成するために使用する
  - [ここ](https://nodejs.org/ja/)から**バージョン16系**の最新のものをダウンロードし, インストールする
  - `node -v` コマンドで `v16.x.y` のようにインストールしたバージョンが表示されることを確認する
- yarn
  - 依存ライブラリのインストールのために使用する
  - バージョン1系を使用する
  - コマンド `npm install --global yarn` を実行する
  - `yarn -v` を実行し, `v1.x.y` のようにバージョンが表示されることを確認する

## 配信データの準備

アプリ本体の準備と, 薄片画像等のデータの準備を行う。

### 最終的なディレクトリ構造

アプリ本体の配信ファイルの配置場所 (ex. `public/`) と, 薄片画像関連ファイルの配置場所 (ex. `sample_image_packages/`) はともに HTTP サーバーがファイルへのアクセス権限を持っているディレクトリでなければならない。
なお、`public/` の下位に `sample_image_packages/` が含まれている必要はない。

```
${public}/
|- css/
|- images/
|- js/
|   |- lib/<外部ライブラリ等>
|   |- app.js
|- index.html
|- make_package.html # アプリからは参照できなくても良い
|- <その他このアプリについて表示するためのHTMLなど、あれば>

${sample_image_packages}/
|- category/
|   |- default.json
|   |- <level1.json> # 閲覧者のレベルなどによってにカテゴリを変える場合、ここにサンプルリストを追加する
|   |- <level2.json>
|   |- <level3.json>
|- packages/
|   |- sample_1/
|   |- sample_2/
|- sample_list/
    |- default.json
    |- <level1.json> # 閲覧者のレベルなどによって見せるサンプルを変える場合、ここにサンプルリストを追加する
    |- <level2.json>
    |- <lavel3.json>
    |- rock_of_prefectures.json
```

### アプリの準備

#### 本体のソースコードのダウンロード

- 適当なディレクトリにGitHubからファイル一式をダウンロードする
- git コマンドが使用できる場合
  - `git clone https://github.com/Fumipo-Theta/microscope_simulator.git`
- git コマンドが使用できない場合
  - [GitHub レポジトリ](https://github.com/Fumipo-Theta/microscope_simulator)から zip 形式でダウンロードし, 適当なディレクトリに展開する
- `microscope_simulator` という名前のディレクトリが存在し, ファイル一式がその中に含まれていることを確認する

#### アプリ作成

1. アプリのプロジェクト生成
2. config JSON 作成
3. アプリのビルド
4. 配信ファイルを HTTP サーバーに設置

##### アプリのプロジェクト生成

アプリをバージョン管理できるよう、別ディレクトリにプロジェクトを生成する。

- ターミナルで `microscope_simulator/` ディレクトリに移動する
- `npm run new:app <app_name>` を実行する
  - `app_name` はスペースを含まないようにすること
- `microscope_simulator` と同階層に `<app_name>/` というディレクトリが作成されていることを確認する
