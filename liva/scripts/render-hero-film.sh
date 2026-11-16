#!/usr/bin/env bash
set -euo pipefail

# Authored ambient motion from the project's generated concept artwork.
# Requires FFmpeg with libx264 and libwebp. No network services are used.
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
asset_dir="$project_dir/assets/campaign"
source_image="${1:-$asset_dir/everyday-film-source.png}"

if [[ ! -f "$source_image" ]]; then
  printf 'Source artwork not found: %s\n' "$source_image" >&2
  exit 1
fi

# Publish complete files together after rendering, so reruns never expose a
# partially written MP4 to the local website.
render_dir="$(mktemp -d "${TMPDIR:-/tmp}/liva-hero-render.XXXXXX")"
trap 'rm -rf -- "$render_dir"' EXIT

# Oversampling makes the very slow camera movement smoother. The camera returns
# to its initial position every 240 frames (10 seconds at 24 fps). A half-frame
# phase aligns the first/last camera crop without a one-pixel rounding step.
# Only the bottom 180 pixels receive displacement. Its feathered mask follows
# the water below the stone ledge, leaving the product and label undistorted.
water_shift='(4*sin(2*PI*T/10+Y/14)+1.3*sin(4*PI*T/10+Y/8+X/250))*clip((Y-30-max(0,X-520)*0.145)/35,0,1)'
filter_graph="[0:v]scale=3840:2160:flags=lanczos,zoompan=z='1.0075-0.0075*cos(2*PI*(on+0.5)/240)':x='(iw-iw/zoom)*0.68':y='(ih-ih/zoom)*0.55':d=1:s=1280x720:fps=24,format=gbrp,split=2[base][water];[water]crop=1280:180:0:540,geq=r='r(clip(X+$water_shift,0,W-1),Y)':g='g(clip(X+$water_shift,0,W-1),Y)':b='b(clip(X+$water_shift,0,W-1),Y)':interpolation=bilinear[ripples];[base][ripples]overlay=0:540:format=rgb,setsar=1,format=yuv420p[film]"

ffmpeg -hide_banner -y -loop 1 -framerate 24 -i "$source_image" \
  -filter_complex_threads 4 -filter_complex "$filter_graph" -map '[film]' \
  -frames:v 240 -r 24 -an -c:v libx264 -preset slow -crf 20 \
  -profile:v high -level:v 3.1 -pix_fmt yuv420p -movflags +faststart \
  -metadata title='LIVA — Everyday ritual, ambient motion study' \
  -metadata comment='Authored FFmpeg motion from AI-generated concept artwork; no audio.' \
  "$render_dir/everyday-film.mp4"

ffmpeg -hide_banner -y -i "$render_dir/everyday-film.mp4" \
  -vf 'scale=768:432:flags=lanczos,setsar=1' -an -c:v libx264 \
  -preset slow -crf 22 -profile:v high -level:v 3.0 -pix_fmt yuv420p \
  -movflags +faststart "$render_dir/everyday-film-mobile.mp4"

ffmpeg -hide_banner -y -i "$render_dir/everyday-film.mp4" \
  -frames:v 1 -c:v libwebp -quality 88 -compression_level 6 \
  "$render_dir/everyday-poster.webp"

ffprobe -v error -select_streams v:0 \
  -show_entries 'stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration,size' \
  -of json "$render_dir/everyday-film.mp4"

mv -- "$render_dir/everyday-film.mp4" "$asset_dir/everyday-film.mp4"
mv -- "$render_dir/everyday-film-mobile.mp4" "$asset_dir/everyday-film-mobile.mp4"
mv -- "$render_dir/everyday-poster.webp" "$asset_dir/everyday-poster.webp"
