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
  project_name = data['project_name']
  row_id = data['row_id']
  rect_coords = data['rect_coords']
  rect_coords_scaled = cal_rect_coords(rect_coords)
  new_file = grabcut_rect(abs_path + 'static/images/'+img_file, rect_coords_scaled, project_name, row_id)
  return jsonify(saved_file = new_file)

@app.route('/refine_grabcut', methods=['POST'])
def refine_grabcut():
  data = request.get_json()
  drawing = data['drawing']
  img_file = data['img_file']
  rect_coords = data['rect_coords']
  project_name = data['project_name']
  row_id = data['row_id']
  rect_coords_scaled = cal_rect_coords(rect_coords)
  scale_drawing(drawing)
  new_file = grabcut_drawing(abs_path + 'static/images/'+img_file, rect_coords_scaled, drawing,project_name,row_id)
  print(new_file)
  return jsonify(saved_file = new_file)

def scale_drawing(drawing):
  scale_factor = drawing['scale_factor']
  drawing['thickness'] = drawing['thickness'] / scale_factor
  for line in drawing['lines']:
    path = line['path']
    for path_seg in path:
      path_seg_type = path_seg[0]
      if (path_seg_type == 'Q'):
          path_seg[2] = path_seg[2] / scale_factor
          path_seg[1] = path_seg[1] / scale_factor


def cal_rect_coords(rect_coords):
  factor = rect_coords['scale_factor']
  rect_coords['left'] = rect_coords['left'] / factor
  rect_coords['height'] = rect_coords['height'] / factor
  rect_coords['width'] = rect_coords['width'] / factor
  rect_coords['top'] = rect_coords['top'] / factor
  return rect_coords

if __name__ == "__main__":
    app.run(debug=True)