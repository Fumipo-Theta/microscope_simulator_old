# General spec of SCOPin rock

## Components

```html
<App>
  <TopNavigation>
    <SampleSelector></SampleSelector>
    <LanguageSelector></LanguageSelector>
  </TopNavigation>
  <SampleHandler>
    <ViewerContainer>
      <SampleViewer>
        <Viewer></Viewer>
        <NicolModeToggler></NicolModeToggler>
      </SampleViewer>
      <SampleDescriptor>
      </SampleDescriptor>
    </ViewerContainer>
  </SampleHandler>
  <Footer></Footer>
</App>
```

### SampleHandler

- Repository から指定されたサンプル画像パッケージのデータへアクセスする関数を生成する
  - ex. 呼び出すことで,ある URL からサムネイルやメタデータ, サンプル画像パッケージを取得する関数
- それらの関数を `ViewerContainer` に渡す

### ViewerContainer

- props で渡された取得関数により, サンプル画像パッケージのデータを取得する
  - サンプル画像パッケージのダウンロードを開始する
  - まずサムネイル画像をダウンロードし表示する
  - メタデータとサンプル画像をダウンロードし, 表示する
- 取得したデータをペイロードとして `SampleViewer` にアクションを渡す

### SampleViewer

- `Viewer` に対し, データを payload としてアクションを渡す
