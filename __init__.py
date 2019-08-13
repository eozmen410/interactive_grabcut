import os
import json
from flask import Flask, request, render_template, g, redirect, Response, url_for, session, send_from_directory
from flask import jsonify
import json
from grabcut import *

abs_path ='./' # '/home/ecenaz/research/demo_grabcut/'

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir)


@app.route('/')
def home():
    return render_template("grabcut_demo.html")

@app.route('/do_grabcut', methods=['POST'])
def do_grabcut():
  data = request.get_json()
  img_file = data['img_file']
  rect_coords = data['rect_coords']
  print(img_file)
  print(rect_coords)
  rect_coords_send = []
  #error checking for less than 2 rects
  for rect in rect_coords:
    if 'left'  in rect:
      rect_coords_send.append(cal_rect_coords(rect))
  print(rect_coords_send)
  new_file = grabcut_rect(abs_path + 'static/images/'+img_file, rect_coords_send)
  print(new_file)
  return jsonify(saved_file = new_file)


def cal_rect_coords(rect_coords):
  factor = rect_coords['scale_factor']
  rect_coords['left'] = rect_coords['left'] / factor
  rect_coords['height'] = rect_coords['height'] / factor
  rect_coords['width'] = rect_coords['width'] / factor
  rect_coords['top'] = rect_coords['top'] / factor
  return rect_coords

if __name__ == "__main__":
    app.run(debug=True)