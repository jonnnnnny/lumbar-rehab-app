#!/bin/sh
# 下载动作演示动画（构建时自动调用；本地直接使用时手动运行一次）
# GIF: exercises-dataset（© Gym visual）
# SVG: workout-guide（CC BY-SA 4.0）
set -e
BASE_GIF="https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos"
BASE_SVG="https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/assets"
ROOT="$(dirname "$0")/../assets/anim"
mkdir -p "$ROOT/gifs" "$ROOT/svg/bird-dog" "$ROOT/svg/hip-flexor-stretch" "$ROOT/svg/chest-row" "$ROOT/svg/hip-thrust"
dl() { # $1=URL $2=本地路径
  if [ -f "$2" ]; then echo "已存在: $(basename $2)"; return; fi
  echo "下载: $(basename $2)"
  wget -q -O "$2" "$1" || curl -sL -o "$2" "$1"
}
# GIF
dl "$BASE_GIF/3147-NKJ8o6x.gif" "$ROOT/gifs/pelvic-tilt.gif"
dl "$BASE_GIF/3013-u0cNiij.gif" "$ROOT/gifs/glute-bridge.gif"
dl "$BASE_GIF/0276-iny3m5y.gif" "$ROOT/gifs/dead-bug.gif"
dl "$BASE_GIF/0705-RKjH6Lt.gif" "$ROOT/gifs/side-plank.gif"
dl "$BASE_GIF/0291-mnzcrIB.gif" "$ROOT/gifs/sit-stand.gif"
dl "$BASE_GIF/0431-aXtJhlg.gif" "$ROOT/gifs/step-up.gif"
dl "$BASE_GIF/0431-aXtJhlg.gif" "$ROOT/gifs/gym-step-up.gif"
dl "$BASE_GIF/1511-99rWm7w.gif" "$ROOT/gifs/hamstring-stretch.gif"
dl "$BASE_GIF/0979-9pa4H5m.gif" "$ROOT/gifs/pallof-press.gif"
dl "$BASE_GIF/0007-4IKbhHV.gif" "$ROOT/gifs/lat-pulldown.gif"
dl "$BASE_GIF/1760-yn8yg1r.gif" "$ROOT/gifs/goblet-squat.gif"
dl "$BASE_GIF/0099-gGNQmVt.gif" "$ROOT/gifs/split-squat.gif"
dl "$BASE_GIF/2133-qPEzJjA.gif" "$ROOT/gifs/farmer-carry.gif"
dl "$BASE_GIF/1459-rR0LJzx.gif" "$ROOT/gifs/db-rdl.gif"
dl "$BASE_GIF/0489-zhMwOwE.gif" "$ROOT/gifs/back-ext.gif"
dl "$BASE_GIF/0234-4f8RXP8.gif" "$ROOT/gifs/standing-cable-row.gif"
dl "$BASE_GIF/0861-fUBheHs.gif" "$ROOT/gifs/seated-cable-row.gif"
dl "$BASE_GIF/0327-7vG5o25.gif" "$ROOT/gifs/chest-supported-db-row.gif"
dl "$BASE_GIF/0739-10Z2DXU.gif" "$ROOT/gifs/leg-press-partial.gif"
dl "$BASE_GIF/0085-wQ2c4XD.gif" "$ROOT/gifs/barbell-rdl.gif"
dl "$BASE_GIF/0410-qx4fgX7.gif" "$ROOT/gifs/bulgarian-split-squat.gif"
dl "$BASE_GIF/1757-gKozT8X.gif" "$ROOT/gifs/single-leg-rdl.gif"
# SVG 分帧
for act in "bird-dog:bird-dog" "hip-flexor-stretch:kneeling-hip-flexor-stretch" "chest-row:chest-supported-row" "hip-thrust:hip-thrust"; do
  local="${act%%:*}"; remote="${act##*:}"
  for i in 1 2 3; do
    dl "$BASE_SVG/$remote/frame-$i.svg" "$ROOT/svg/$local/frame-$i.svg"
  done
done
echo "完成"
