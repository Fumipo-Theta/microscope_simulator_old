# 薄片画像上のレイヤー表示の仕様

## 要件

- 薄片画像に対し, 以下のような情報を付加する。
  - 薄片画像上の領域の輪郭線の描画や塗りつぶし
  - ラベルテキスト表示
  - 注釈の表示
- 情報はレイヤーとしてまとめて管理できるようにする
- 複数のレイヤーを同時に扱えるようにする
- 情報の表示状態は薄片画像の回転に同期して変化する
  - 輪郭線は, 回転する薄片画像上の座標に対し固定される
  - ラベルテキストは, テキストアンカーの位置が回転する薄片画像上の座標に対し固定され, 文字列の表示方向は画面に対して固定される
  - 注釈は, 指し示す位置が回転する薄片画像上の座標に対し固定され, アイコンの方向は画面に対して固定される
- 薄片画像の回転角に応じて, レイヤーごとに表示・非表示を切り替えられるようにする
  - 複数の不連続な回転角範囲で表示・非表示を切り替えられるようにする
- 1レイヤー内の情報表示を, 顕微鏡のオープンニコル・クロスニコルの状態に応じて切り替えられるようにする
- 注釈は, アイコンを押すとメッセージが表示されるようにする
  - メッセージの内部にハイパーリンクを含められるようにする

## 実現方針

- レイヤーはJSON形式で表現する
- オーバーレイ画像は透過に対応する必要がある
  - ラスター形式(PNG)とベクター形式(SVG)に対応することとする
- レイヤーの中でオーバーレイ画像は, 画像へのパス(サンプル画像パッケージ内の相対パス)で指定する
- 前提として, オーバーレイ画像は薄片写真と同じピクセルサイズで, 回転中心の座標も一致しているものとする
- ラベルテキストと注釈の表示位置は, 回転角0°の薄片画像上の座標で指定する
  - 画像の左上を基準とした右方向・下方向を正とする, x・y座標で指定する
- 注釈のメッセージは, 薄片画像の外部に表示する
- 注釈のメッセージはHTMLとする
  - ハイパーリンクを含められるようにするため
  - 文書のスタイリングを可能にする余地を残すため

## 画面イメージ

- オーバーレイとラベル
  - ![](./images/screen_overlay_and_labels_on_viewer.png)
- 注釈
  - ![](./images/screen_annotation_on_viewer.png)

データ構造と画面上の要素の対応
![](./images/data_structure_of_a_layer.png)

## 各レイヤーのデータ構造

### Layer

- `reference_rotation_degree`: `0` (number, required) - レイヤーの座標の基準となる薄片画像の回転角
- `overlays` (array, optional) - オーバーレイ画像に関する情報
  - object
    - `_note`: `管理上のメモ用` (any, optional) - アプリでは使用されない項目
    - `appears_during`:`[[0, 90], [180, 270]]` (array, required) - レイヤーを表示する薄片画像の回転角の範囲の配列。角度は反時計回りに数える
    - `appears_in`: `open` (enum, required) - オープン・クロス・両方のいずれのモードで表示するか
      - `open`
      - `crossed`
      - `both`
    - `image_type`: `png` (enum, required) - 画像フォーマット
      - `png`
      - `svg`
    - `image_source`: `overlay_for_open_nicols.png` (string, required) - 画像のパス。
- `labels` (array, optional) - 薄片画像上に表示する文字列に関する情報の配列
  - object
    - `_note`: `管理上のメモ用` (any, optional) - アプリでは使用されない項目
    - `appears_during`:`[[0, 90], [180, 270]]` (array, required) - レイヤーを表示する薄片画像の回転角の範囲の配列。角度は反時計回りに数える
    - `appears_in`: `open` (enum, required) - オープン・クロス・両方のいずれのモードで表示するか
      - `open`
      - `crossed`
      - `both`
    - `position_from_left_top` (object, required) - 薄片画像の左上を基準とした文字列の座標。文字列を包含する長方形の中心の座標
      - `x`: `500` (number, required)
      - `y`: `450` (number, required)
    - `text`: (object, required) - ラベルのテキスト。アプリの言語モードに対応する文言が設定されていない場合はラベルが表示されない
      - `ja`: `斜長石` (string, optional)
      - `en`: `Plagioclase` (string, optional)
    - `color` (object, optional) - ラベルのオープン・クロスそれぞれにおける文字色。16進数のRGBA形式で表す。指定されなければアプリのデフォルト値(in_open: `#000000ff`, in_crossed: `#ffffffff`)が使用される
      - `in_open`: `#000000ff` (string, optional)
      - `in_crossed`: `#ffffffff` (string, optional)
- `annotations` (array, optional) - 薄片画像上に表示する注釈アイコンと, 注釈メッセージの情報の配列
  - object
    - `_note`: `管理上のメモ用` (any, optional) - アプリでは使用されない項目
    - `appears_during`:`[[0, 90], [180, 270]]` (array, required) - レイヤーを表示する薄片画像の回転角の範囲の配列。角度は反時計回りに数える
    - `appears_in`: `open` (enum, required) - オープン・クロス・両方のいずれのモードで表示するか
      - `open`
      - `crossed`
      - `both`
    - `position_from_left_top` (object, required) - 薄片画像の左上を基準とした注釈アイコンの座標
      - `x`: `100` (number, required)
      - `y`: `200` (number, required)
    - `icon_color` (object, optional) - 注釈アイコンのオープン・クロスそれぞれにおける塗りつぶし色。16進数のRGBA形式で表す。指定されなければアプリのデフォルト値(in_open: `#000000ff`, in_crossed: `#ffffffff`)が使用される
      - `in_open`: `#2196f3ff` (string, optional)
      - `in_crossed`: `#FF3100ff` (string, optional)
    - `message` (object, required) - オープン・クロスそれぞれで表示する注釈メッセージの内容。アプリの言語モードに対応する文言が設定されていない場合は注釈アイコンが表示されない。HTMLで表記可能
      - `in_open`: (object, optional)
        - `ja`: `画像上の注釈の説明。HTML文字列を使用可能` (string, optional)
        - `en`: `Description of the point. Details are available <a href=\"https://path.to/details\">here</a>.` (string, optional)
      - `in_crossed`: (object, optional)
        - `ja`: `画像上の注釈の説明。HTML文字列を使用可能` (string, optional)
        - `en`: `Another text to be shown in crossed Nicols mode.` (string, optional)


## 複数のレイヤーを表すJSONの例

[上のLayer](#Layer)オブジェクトの配列として表す。
[例を参照のこと](/example_image_package_root/packages/Q27_quartz/layers.json)。

```json
{
  "layers":[
    {
      "reference_rotation_degree": 0,
      "overlays": [
        {
          "_note": "message for management",
          "appears_during": [
            [0, 90],
            [180, 270]
          ],
          "image_type": "png",
          "appears_in": "open",
          "image_source": "path/to/overlay_for_open_nicols.png"
        }
      ],
      "labels": [
        {
          "appears_during": [
            [0, 180]
          ],
          "appears_in": "open",
          "position_from_left_top": {
              "x": 500,
              "y": 450
          },
          "text": {
            "ja": "斜長石",
            "en": "Plagioclase"
          },
          "color": {
              "in_open": "#000000ff"
          }
        }
      ],
      "annotations": [
        {
          "appears_during": [
            [0, 180]
          ],
          "appears_in": "both",
          "position_from_left_top": {
              "x": 100,
              "y": 200
          },
          "icon_color": {
              "in_open": "#2196f3ff",
              "in_crossed": "#FF3100ff"
          },
          "message": {
              "in_open": {
                "ja": "画像上の注釈の説明。HTML文字列を使用可能",
                "en": "Description of the point. Details are available <a href=\"https://pathtodetails\">here<a>."
              },
              "in_crossed": {
                "en": "Another text to be shown in crossed Nicols mode."
              }
          }
        }
      ]
    }
  ]
}
```

### Layerを定義したJSONファイルの配置場所
