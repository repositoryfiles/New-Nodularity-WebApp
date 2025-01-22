# nodularity_web_app.html
 Web app for determining nodularity of graphite

# 概要
球状黒鉛鋳鉄品（FCD）の組織画像について、JIS G5502-2022 球状黒鉛鋳鉄品のISO法およびJIS法によって黒鉛球状化率を求めるプログラムです。ここで、組織画像とは下図のようなものです。

<img src="https://github.com/repositoryfiles/Nodularity-WebApp/assets/91704559/85a59827-c485-40f9-86cf-18aa6775d183.jpg" width="400">

図 球状黒鉛鋳鉄品の組織画像

# 動作環境
インターネットが接続された環境で動作します。このプログラムは実行時に画像処理のライブラリOpenCV Ver.4.4.0を読み込んでいます。

# 使い方
- EdgeやChromeなどのブラウザでnodularity_web_app.html を開きます。
- 左上に「準備完了」と表示されれば使用可能です。
- 倍率100倍で撮影した組織画像をご用意ください。このURLにあるjpgファイルはテスト用です。
- 読み込む画像のパラメータを設定します。**画像の幅**には、組織画像の幅いっぱいにスケールバーを入れたと想定したときの数値をμm単位で入力します。テスト用画像については、画像の幅は1420となります。

<img src="https://github.com/repositoryfiles/New-Nodularity-WebApp/assets/91704559/e9a0cee6-571b-4007-b819-e720606dadb1" width="400">

図　組織画像の幅いっぱいに入れたスケールバーと数値の例

- **黒鉛の長さ**には黒鉛として認識させる最小の長さ（JIS G5502：2022では10μmとされています）を入力します。
- **ファイルを選択**をクリックして画像ファイルを読み込みます。複数の画像を読み込むことも可能です。
- 少し待つ（パソコンの処理速度によります）と、ブラウザにJIS法とISO法の球状化率の計算結果が表示され、ダウンロードの保存先の指定フォルダに画像ファイルが保存されます。
- 保存されるファイル名と内容は次のとおりです。
- JIS法
    - ファイル名：元のファイル名+_result(JIS)_球状化率.jpg
    - 内容：JIS法で黒鉛の形状を色分けしたもの
（Ⅰ：赤、Ⅱ：紫、Ⅲ：緑、Ⅳ：水色、Ⅴ：青）
- ISO法
    - ファイル名：元のファイル名+_result(ISO)_球状化率.jpg
    - 内容：ISO法で黒鉛の形状を色分けしたもの
（青：ⅤとⅥ、赤：Ⅰ～Ⅳ）
 
# 注意事項

1. JIS G5502-2022 では、黒鉛の形状を次式で定義される丸み係数というパラメータで評価しますが
```math
\text{丸み係数} = \frac{\text{黒鉛の面積}}{\text{黒鉛の最大軸長を直径とする円の面積}}　　　(1)
```
&emsp;&emsp;このプログラムでは、式(1)の分母を
```math
\text{丸み係数の近似値} = \frac{\text{黒鉛の面積}}{\text{黒鉛の最小外接円を直径とする面の面積}}　　　(2)
```

&emsp;&emsp;と置いた「丸み係数の近似値」を使って球状化率を評価しています。<br>
&emsp;&emsp;「丸み係数の近似値」から求めた球状化率は「丸み係数」から求めた球状化率に比べて若干低い値になります。<br>
&emsp;&emsp;https://qiita.com/_Moony/items/4a0b84bca07e21f4b0fa

2. JIS G5502-2022の内容を理解の上、お使いください。<br>
3. プログラムの使用結果について当方は責任は負いません。

# 開発環境
- Windows11
- OpenCV.js 4.9.0




