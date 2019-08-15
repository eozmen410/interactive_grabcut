import numpy as np
import cv2
from matplotlib import pyplot as plt
import os


def grabcut_rect(image_path, rect_coords, project_name, row_id):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    dimy = np.shape(img)[0]
    dimx = np.shape(img)[1]
    mask = np.zeros((dimy,dimx),np.uint8) #initialize empty mask
    bgdModel = fgdModel = np.zeros((1,65),np.float64)

    x = int(rect_coords['left'])
    y = int(rect_coords['top'])
    h = int(rect_coords['height'])
    w = int(rect_coords['width'])
    rect = (x, y, w, h)

    mask, bgdModel, fgdModel = cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)

    img_file_name = new_file_name(project_name, row_id)

    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
    img2 = img*mask2[:,:,np.newaxis]
    
    #to save the image without black background
    tmp = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    _,alpha = cv2.threshold(tmp,0,255,cv2.THRESH_BINARY)
    b, g, r = cv2.split(img2)
    rgba = [b,g,r, alpha]
    img2_refined = cv2.merge(rgba,4)
    cv2.imwrite(img_file_name, img2_refined)

    #send the new file name back
    return img_file_name 

def resize_and_write(img_path, img, rect_coords):
    print(rect_coords)
    # img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    x = int(rect_coords['left'])
    y = int(rect_coords['top'])
    h = int(rect_coords['height'])
    w = int(rect_coords['width'])
    print(rect_coords)
    crop_img = img[y:y+h, x:x+w]
    cv2.imwrite(img_path, crop_img)

#give a unique name to each saved file grabcut_0,1,2,...
#def new_file_name(image_path):
def new_file_name(project_name, row_id):
    #index = image_path.rfind('.')

    file_path = "./static/images/"+project_name+"/"+str(row_id)+"/"
    if(not os.path.isdir(file_path)):
        os.mkdir(file_path)
    new_name = file_path + 'grabcut'
    i = 0
    while os.path.isfile(new_name + str(i) + '.png' ):
        i += 1
    return  new_name+ str(i) + '.png'


def grabcut_drawing(image_path, rect_coords, drawing,project_name, row_id):
    print('in refine grab cut!')
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    dimy = np.shape(img)[0]
    dimx = np.shape(img)[1]

    mask = np.zeros((dimy,dimx),np.uint8) #initialize empty mask
    bgdModel = fgdModel = np.zeros((1,65),np.float64)

    x = int(rect_coords['left'])
    y = int(rect_coords['top'])
    h = int(rect_coords['height'])
    w = int(rect_coords['width'])
    rect = (x, y, w, h) #make rect to initialize with rect
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    bgdModel = np.zeros((1, 65), np.float64) #zero out foreground and background models
    fgdModel = np.zeros((1, 65), np.float64)

    # make the drawing on the mask, 
    # for each line in the drawing,
    #  for each point in the line, make a circle with the scaled thickness on the mask    
    lines = drawing['lines']
    thickness = drawing['thickness']
    for line in lines:
        path = line['path']
        for path_seg in path:
            path_seg_type = path_seg[0]
            if (path_seg_type == 'Q'):
                # print('CIRCLE IN MASK')
                
                x1 = int(path_seg[1])
                y1 = int(path_seg[2])
                if (x1 > dimx or x1 < 0) or (y1> dimy or y1 < 0) :
                    continue
                cv2.circle(mask, (x1,y1), int(thickness), 0, -1)


    mask, bgdModel, fgdModel = cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_MASK)
    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
    img2 = img*mask2[:,:,np.newaxis]

    img_file_name = new_file_name(project_name, row_id)
    
    #to save the image without black background
    tmp = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    _,alpha = cv2.threshold(tmp,0,255,cv2.THRESH_BINARY)
    b, g, r = cv2.split(img2)
    rgba = [b,g,r, alpha]
    img2_refined = cv2.merge(rgba,4)
    cv2.imwrite(img_file_name, img2_refined)
    
    #send the new file name back
    return img_file_name
