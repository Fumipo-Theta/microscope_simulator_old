# 薄片画像上のレイヤーデータの作成方法

[仕様はここ](../design/spec_for_layer_on_the_viewer.md)。

## レイヤーを表すJSONファイルの作成

- 上の仕様の[このセクション](../design/spec_for_layer_on_the_viewer.md#複数のレイヤーを表すJSONの例)に従ってJSONファイルを準備する
- JSONファイルの配置場所は, 薄片画像パッケージの直下。`path/to/thin_section_package/layers.json`とする

## オーバーレイ画像の作成

- 仕様のように, オーバーレイ画像はPNG形式かSVG形式で作成する(最初にPNG形式から対応する予定)
- オーバーレイ画像のピクセルサイズは, 薄片の画像と同じにする。回転中心も合わせておく
- オーバーレイ画像は, 薄片画像パッケージの直下に`overlays`ディレクトリを作り, その中に配置する
  - `path/to/thin_section_package/overlay/overlay_image_name.png`のように配置する
