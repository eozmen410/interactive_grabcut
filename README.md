# Interactive Grabcut with Flask

## Running the App

* Use `python __init__.py` to run the flask server. 
* Go to http://127.0.0.1:5000/ on your browser. 

## Adding your own images
* Make a new directory with a project name you want under /static/images. 
* In this directory, make a directory for the original images called "_original".
* Add your images to the directory names _original.
* Go to /static/js/grabcut_demo.js and call 
`makeGrabCutRow(appending_container,image_path, project_name)` 
   with the id of the container you want to append to (you can also use the appending_container variable already defined), the path to the image, and the project name. 
* The path to the image should be `../static/images/<project_name>/_original/<image_file_name>`

## Dependencies
* To run the app you will need opencv-python and numpy, use the following to install them:

`pip install opencv-python` 

`pip install numpy`

