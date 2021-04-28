let bf_url = "https://coolors.co/9b5de5-f15bb5-fee440-00bbf9-00f5d4";
let url = bf_url.split("/");
console.log(  url[3] );
let new_color = url[3].split("-");
let colors = [];
for(let i= 0; i < new_color.length; i++) {
  //console.log(colors[i]);
//  colors[i] = colors; 
 colors[i] = "#" + new_color[i];
}
// new_color = colors;
console.log(colors);

//let colors = ["#006d77", "#83c5be", "#edf6f9", "#ffddd2", "#e29578"];

function setup() {
  //カンバスサイズの設定
  createCanvas(600, 600);
  //カラーモードの指定（HSB推奨）
  colorMode(HSB, 360, 100, 100, 100);

  //角度を弧度法から度数法に指定
  angleMode(DEGREES);
  //背景色を指定
  background(0,0,0);

  //画面上にたくさんの点を打つことで粒状感を背景に加える
  //点の密度，個数はカンバスのサイズに対して何％打つかを考えてみる
 for (let i = 0; i < width * height * 5 / 100; i++) {
    //半透明の点，白でも黒でもOK．透明度は適宜調整する
   fill(255);
   stroke(255, 255, 255,70);
   
    let px = random(width);
    let py = random(height);
    point(px, py);
  }

  let cells = int(random(3,12)); // 3~11までのランダムな数値
  let offset = width / 10;
  let margin = offset / 5;
  let w = (width - offset * 2 - margin * (cells - 1)) / cells;
  let h = (height - offset * 2 - margin * (cells - 1)) / cells;

  //格子状に図形を配置する基本的な方法
  //2重for文で縦横方向にxyの位置を計算し，その位置を基準に図形を配置する
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      let x = offset + i * (w + margin);
      let y = offset + j * (h + margin);
      let cx = x + w / 2;
      let cy = y + h / 2;
      let d = w;
      let rotate_num = int(random(4)); // 0〜3の整数
      rotate_num = rotate_num * 90; // 0,90,180,270
      let shape_num = int(random(4));

      let c = random(colors);

      push();
      translate(cx, cy);
      rotate(rotate_num);
      if (random(100) > 50) {
        noStroke();
        fill(c);
      } else {
        noFill();
        stroke(c);
      }
      if (shape_num == 0) {
        //triangle(-d / 2, -d / 2, d / 2, -d / 2, -d / 2, d / 2);

        console.log(-d/2);
        beginShape();
vertex(0, -d/2+10);
bezierVertex(0, -d/2-10, 40, -d/2+10, 0, -d/2+35);
vertex(0, -d/2+10);
bezierVertex(0, -d/2-10, -40, -d/2+10, 0, -d/2+35);
endShape();
        
      } else if (shape_num == 1) {
        rectMode(CENTER);
        rect(0, 0, d, d);
      } else if (shape_num == 2) {
        ellipse(0, 0, d, d);
      } else if (shape_num == 3) {
        arc(-d / 2, -d / 2, d * 2, d * 2, 0, 90);
      }
      pop();
    }
  }
  
  let s = '';
fill(255);
  noStroke();
text(s, 10, 10, 70, 80); // Text wraps within text box
}