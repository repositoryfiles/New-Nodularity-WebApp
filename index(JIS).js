﻿//画像の画面表示は幅400とするが、解析は元画像のサイズで行う

let imgElement = document.getElementById('src_image');
let imgHiddenElement = document.getElementById('hidden_src_image');
let inputElement = document.getElementById('input_file');
let canvas = document.getElementById('canvas_image');
let graphiteRatioBtn = document.getElementById('graphite_ratio_btn');
let downloadBtn = document.getElementById('download_btn');

let FILENAME; //入力画像のファイル名
let nodularityJIS; //球状化率

inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
  imgHiddenElement.src = URL.createObjectURL(e.target.files[0]);
  //FILENAME = e.target.files[0].name.split('.')[0]; //入力ファイル名をFILENAMEに格納（画像の保存時に使用）
  FILENAME = e.target.files[0].name;
}, false);

graphiteRatioBtn.addEventListener('click', e => {
  graphite();
});

downloadBtn.addEventListener('click', e => {
  //アンカータグを作成
  var a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg', 0.9);
  filename = FILENAME + "_result(JIS)_" + nodularityJIS.toPrecision(3) + ".jpg";
  a.download = filename;
  a.click();
});

function graphite(){
  let src = cv.imread(imgHiddenElement);
  let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  let contours1 = new cv.MatVector();
  let hierarchy1 = new cv.Mat();

  let black_color = new cv.Scalar(0, 0, 0);
  let red_color = new cv.Scalar(255, 0, 0, 255); //(255, 0, 0)とすると白色で描画されるためアルファチャンネルを追加
  let blue_color = new cv.Scalar(0, 0, 255, 255);
  let lightblue_color = new cv.Scalar(0, 255, 255, 255);
  let green_color = new cv.Scalar(0, 255, 0, 255);
  let violet_color = new cv.Scalar(128, 0, 128, 255);

  let marumi_ratio = 0.6;//iso法で形状ⅤとⅥと判定する丸み係数のしきい値
  let sum_graphite_areas = 0;
  let sum_graphite_areas_5and6 = 0;
  let num_graphite1 = num_graphite2 = num_graphite3 = num_graphite4 = num_graphite5 = 0;

  //画像のグレースケール化、反転二値化、輪郭（黒鉛の輪郭）の抽出
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(dst, dst, 0,255,cv.THRESH_BINARY_INV+cv.THRESH_OTSU);
  cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

  //テキストボックスの値を取得
  let minimum_graphite_length = document.getElementById('minimum_graphite_length').value;
  let picture_width = document.getElementById('picture_width').value;

  //最小黒鉛の大きさ÷画像の幅 の計算
  let miniGraSize = minimum_graphite_length / picture_width;

  //最小黒鉛の長さより小さい黒鉛と、画像の縁に掛かっている黒鉛を背景と同じ色（黒色）に塗りつぶす
  for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i);
      let rect = cv.boundingRect(cnt);  // rect.x, rect.y, rect.width, rect.height
      let circle = cv.minEnclosingCircle(cnt); //  circle.center, circle.radius
      if ((src.cols * miniGraSize > 2 * circle.radius) || (1 > rect.x) || (1 > rect.y)
        || ((rect.x + rect.width) >= src.cols) || ((rect.y + rect.height) >= src.rows)){
          cv.drawContours(dst, contours, i, black_color, cv.FILLED);
      }
  }
  contours.delete();
  hierarchy.delete();

  //球状化率の判定に用いる輪郭を抽出
  cv.findContours(dst, contours1, hierarchy1, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
  //cv.drawContours(src, contours1, -1, red_color, cv.FILLED);
  //dst.delete();

  for (i = 0; i < contours1.size(); ++i) {
    cnt = contours1.get(i);
    graphite_area = cv.contourArea(cnt);
    sum_graphite_areas += graphite_area;
    circle = cv.minEnclosingCircle(cnt);

    //丸み係数の算出
    let marumi = graphite_area / (circle.radius * circle.radius * 3.14159);

    //JIS法による形状分類
    if(marumi <= 0.2){
      num_graphite1 += 1;
      cv.drawContours(src, contours1, i, red_color, cv.FILLED); //赤
    }
    if(0.2 < marumi && marumi <= 0.4){
      num_graphite2 += 1;
      cv.drawContours(src, contours1, i, violet_color, cv.FILLED); //紫
    }
    if(0.4 < marumi && marumi <= 0.7){
      num_graphite3 += 1;
      cv.drawContours(src, contours1, i, green_color, cv.FILLED); //緑
    }
    if(0.7 < marumi && marumi <= 0.8){
      num_graphite4 += 1;
      cv.drawContours(src, contours1, i, lightblue_color, cv.FILLED); //水色
    }
    if(0.8 < marumi){
      num_graphite5 += 1;
      cv.drawContours(src, contours1, i, blue_color, cv.FILLED); //青
    }
  }

  //球状化率（JIS法）
  nodularityJIS = (0.3 * num_graphite2 + 0.7 * num_graphite3 + 0.9 * num_graphite4 + 1.0 * num_graphite5)/ contours1.size() * 100;

  //結果の表示
  cv.imshow('canvas_image', src);
  src.delete();

  var display_result = document.getElementById("display_result");
  display_result.innerHTML = "JIS法による球状化率(%) : " + nodularityJIS.toPrecision(3);

  contours1.delete();
  hierarchy1.delete();
}

