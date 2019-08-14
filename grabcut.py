import numpy as np
import cv2
from matplotlib import pyplot as plt
import os


def grabcut_rect(image_path, rect_coords_list, project_name, row_id):
    print('IMAGE PATH: ' + image_path)
    print('in grab cut!')
    # print(rect_coords)
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    # cv2.imshow('initial', img)
    # cv2.waitKey(0)
    dimy = np.shape(img)[0]
    dimx = np.shape(img)[1]
    print("dimy")
    print(dimy)
    print("dimx")
    print(dimx)
    mask = np.zeros((dimy,dimx),np.uint8) #initialize empty mask
    bgdModel = fgdModel = np.zeros((1,65),np.float64)

    print('in grabcut rect_coords_list')
    print(rect_coords_list)
    #make probable foreground with rect_coords
    for rect_coords in rect_coords_list:
        # rect_coords = rect_coords_list[i]
        mask_val = int(rect_coords['gc_mask_value'])
        print('mask val ')
        print(mask_val)
        x = int(rect_coords['left'])
        y = int(rect_coords['top'])
        h = int(rect_coords['height'])
        w = int(rect_coords['width'])

        for iy in range(y, y+h):
            if iy >= dimy:
                break
            for ix in range(x, x+w):
                if ix >= dimx:
                    break
                mask[iy][ix] = mask_val 
    

    print('out of looping mask') 
    print('entering grabcut')
    mask, bgdModel, fgdModel = cv2.grabCut(img,mask,None,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_MASK)
    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
    img2 = img*mask2[:,:,np.newaxis]

    img_file_name = new_file_name(project_name, row_id)
    print(" IMAGE FILE NAME!!!!!!!!!!")
    print(img_file_name)
    
    del mask
    del bgdModel
    del fgdModel
    
    #to save the image without black background
    src = img2
    tmp = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    _,alpha = cv2.threshold(tmp,0,255,cv2.THRESH_BINARY)
    b, g, r = cv2.split(src)
    rgba = [b,g,r, alpha]
    dst = cv2.merge(rgba,4)
    cv2.imwrite(img_file_name, dst)
    #can remove this call if we don't want to crop the image after grabcut
    # resize_and_write(img_file_name, dst, rect_coords_list[0])
    
    #send the new file name back
    return img_file_name #img_file_name.split('/')[-1]

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

#give a unique name to each saved file imgID_grabcut_0,1,2,...
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

def cat_masks(mask, newmask) :
    newnewmask =  np.zeros((dimy,dimx),np.uint8)
    # count = 0
    for x in range(0, dimx):
        for y in range(0, dimy):
            if mask[y][x] == 3  or newmask[y][x] == 3:
                newnewmask[y][x] = cv2.GC_PR_FGD
                # count +=1
    # print('count: ' + str(count))
    return newnewmask


def grabcut_drawing(image_path, rect_coords, drawing,project_name, row_id):
    print('in refine grab cut!')
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    dimy = np.shape(img)[0]
    dimx = np.shape(img)[1]
    print("dimy")
    print(dimy)
    print("dimx")
    print(dimx)

    mask = np.zeros((dimy,dimx),np.uint8) #initialize empty mask
    bgdModel = fgdModel = np.zeros((1,65),np.float64)

    print('in grabcut rect_coords_list')
    #mask_val = int(rect_coords['gc_mask_value'])

    x = int(rect_coords['left'])
    y = int(rect_coords['top'])
    h = int(rect_coords['height'])
    w = int(rect_coords['width'])
    rect = (x, y, w, h) #make foreground with rect_coords
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 1, cv2.GC_INIT_WITH_RECT)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    thickness = drawing['thickness']
    # print('THICKNESS')
    # print(thickness)
    # print(drawing)
    lines = drawing['lines']
    for line in lines:
        print ('line!!!!!!!')
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
    src = img2
    tmp = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    _,alpha = cv2.threshold(tmp,0,255,cv2.THRESH_BINARY)
    b, g, r = cv2.split(src)
    rgba = [b,g,r, alpha]
    dst = cv2.merge(rgba,4)
    cv2.imwrite(img_file_name, dst)
    # resize_and_write(img_file_name, dst, rect_coords_list[0])
    
    #send the new file name back
    return img_file_name#img_file_name.split('/')[-1]
