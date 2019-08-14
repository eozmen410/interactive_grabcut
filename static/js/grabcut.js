canvas_height = 300
canvas_width = 300

function getIdNumber(){
    let x = Math.floor((Math.random() * 10000) );
    if(x<1000){
        x=x+1000 // VERY JANKY way to make sure the id is exsctly 4 characters.
    }
    return x
}

function getGrabcutCanvasId(id, canvas_num){
    return "grabcut_"+id+"_canvas_"+canvas_num
}

function makeProbableForegroundFabricCanvas(myCanvasObj, appendToCol){
    let canvas1_id = myCanvasObj.id
    myCanvasObj.ready = false;
    let canvas_html = $("<canvas>")        
    $(canvas_html).attr("id", myCanvasObj.id)
    $(canvas_html).attr("height", canvas_height)
    $(canvas_html).attr("width", canvas_width)
    $(appendToCol).append(canvas_html) 


    //create fabric canvas
    var canvas = new fabric.Canvas(canvas1_id);



    //setBackgroundImage(canvas, imageURL)
    // https://stackoverflow.com/questions/47010467/fit-the-background-image-to-canvas-size-with-fabric-js/47074188
    fabric.Image.fromURL(myCanvasObj.imageURL, function(img) {
        let original_height = img._originalElement.height
        let original_width = img._originalElement.width

        let max_dimension = Math.max(original_height, original_width)
        
        let scale_determine = original_height > original_width ? original_height : original_width
        let scale_factor = 300/scale_determine    //original_width

        //set the global scale_factor variable
        myCanvasObj.scale_factor = scale_factor
        console.log(myCanvasObj.scale_factor)
        myCanvasObj.img = img
        myCanvasObj.img_height = original_height * scale_factor
        myCanvasObj.img_width = original_width * scale_factor

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: scale_factor,
            scaleY: scale_factor,
            //img: img
        });
        });



    //MAKE RECT DRAWING
    // http://jsfiddle.net/a7mad24/aPLq5/

    var rect, isDown, origX, origY;
    var hasRect = false

    canvas.on('mouse:down', function(o){
        if(hasRect){
            console.log("has rect")
            return; // do nothing if there is already a rect
        } 

        isDown = true;
        var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        var pointer = canvas.getPointer(o.e);
        rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x-origX,
            height: pointer.y-origY,
            angle: 0,
            fill: 'rgba(0,255,0,0.5)',
            transparentCorners: false,
            hasRotatingPoint: false,
        });
        canvas.add(rect);
    });

    canvas.on('mouse:move', function(o){
        if(hasRect) return; // do nothing if there is already a rect

        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);
        
        if(origX>pointer.x){
            rect.set({ left: Math.abs(pointer.x) });
        }
        if(origY>pointer.y){
            rect.set({ top: Math.abs(pointer.y) });
        }
        
        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });
        
        
        canvas.renderAll();
    });

    canvas.on('mouse:up', function(o){
        if(hasRect) return; // do nothing if there is already a rect
        isDown = false;
        canvas.getActiveObject().setCoords()
        canvas.renderAll();

        hasRect = true // indicate that a rectangle has been drawn
        myCanvasObj.ready = true
    });

    return canvas


}

function makeBackgroundDrawingFabricCanvas(myCanvasObj, appendToCol) {
    let canvas_id = myCanvasObj.id
    let canvas_html = $("<canvas>")        
    $(canvas_html).attr("id", canvas_id)
    $(canvas_html).attr("height", canvas_height)
    $(canvas_html).attr("width", canvas_width)
    $(appendToCol).append(canvas_html) 
    
    var canvas = new fabric.Canvas(canvas_id);


    canvas.isDrawingMode = true
    canvas.freeDrawingBrush.color = "green";
    canvas.freeDrawingBrush.width = 1;

    let add_back_detail_button = $("<button class='btn btn-primary'>Add Back Detail</button>")
    $(appendToCol).append(add_back_detail_button)
    $(add_back_detail_button).click(function(){ 
        console.log("add_back_detail_button")
        grabCutRefinement_Add(canvas_3_add, obj, canvas4_id, obj.image.original_image)
    })

}

function makeGrabCutRow(appending_container,imageURL, project_name) {
    //console.log(imageURL)
    let id = getIdNumber()


    let obj = {
        id: id,
        row_type: "grabcut",
        project_name: project_name,
        image: {
            imageURL: imageURL,// this is how I do undefined - so it converts to python ok, if I need that.
            scale_factor: 1, //default of no scaling factor
            height: "",
            width: "",
            original_image: "",
        },
        canvas1: {}, //fabric canvas
        canvas2: {}, //reg canvas (opencv)
        //canvas3: {},

        }
    // CREATE FRAMRWORK FOR ALL CANVASES 
    let new_row = $("<div class='row'>")
    let col1 = $("<div class='col-md-4'>")
    let col2 = $("<div class='col-md-4'>")
    let col3 = $("<div class='col-md-4'>")

    $(new_row).append(col1).append(col2).append(col3) // GOT RID OF THIS        
    $("#"+appending_container).append(id)
    $("#"+appending_container).append(new_row)


    //CREATE ROW 1 (Fabric cancas for drawing)
    let canvas1_id = getGrabcutCanvasId(id, "1")
    obj.canvas1 = {
        type: "fabric_canvas",            
        id: canvas1_id,
        // height : canvas_height,
        // width: canvas_width,
        imageURL: imageURL,
        scale_factor: 1, //default of no scaling factor
        img_height: "",
        img_width: "",
        original_image: "",

    }


    var fg_fabric_canvas = makeProbableForegroundFabricCanvas(obj.canvas1, col1 /*append to col1 */)

    // var fg_fabric_canvas_2 = makeProbableForegroundFabricCanvas(obj.canvas2, col2 /*append to col1 */)

    let canvas2_id = getGrabcutCanvasId(id, "2")

    obj.canvas2 = {
        type: "fabric_canvas",            
        id: canvas2_id,
    }
    // makeBackgroundDrawingFabricCanvas(obj.canvas2, col3)

    let do_grabcut_button = $("<button class='btn btn-primary'><span class= 'glyphicon glyphicon-scissors'></span></button>")
    $(col1).append(do_grabcut_button)
    $(do_grabcut_button).click(function(){ 
        if(!obj.canvas1.ready){

            alert("Please draw rectangle")
        }


        console.log("grabCut!!!!!!!!!!!!!!!!!!!!!!")

        var rect_1 = get_active_rect_of_canvas(fg_fabric_canvas)
        rect_1.scale_factor = obj.canvas1.scale_factor
        rect_1.gc_mask_value = cv.GC_PR_FGD
        // var rect_2 = get_active_rect_of_canvas(fg_fabric_canvas_2)
        // rect_2.scale_factor = obj.canvas2.scale_factor
        // rect_2.gc_mask_value = cv.GC_BGD
        console.log(rect_1)
        // console.log(rect_2)

        // var rect_list = [rect_1, rect_2]
        var rect_list = [rect_1]

        let row_id = id        
        do_grabcut_backend(imageURL.replace("../static/images/", ""),  rect_list , col2, appending_container, obj)

    })




    return obj
}

function get_active_rect_of_canvas(fabric_canvas) {
    let active = fabric_canvas.getActiveObject()
    console.log("active")
    console.log(active)

    if(active) {
        let left = active.left
        let top = active.top
        let width = active.width * active.scaleX
        let height = active.height * active.scaleY


      return  {
            'left' : left,
            'top' : top,
            'width' : width,
            'height' : height
        }

    
    } else {
        console.log("no Fabric rect")
    }
    return {}
}


// 
// rect_cord are the coordinates of the rectangl
// where is the id of the div to append the returned image to.
//div_id
function do_grabcut_backend(img_file, rect_coords,  where, div_id, obj){ //} project_name, row_id) {
    console.log("div_id", div_id)
    console.log("row_id", obj)
    $(where).empty()
    var loading_img = $("<div id='loading_" +div_id +"'>")
		$(loading_img).append("<img src='../static/ajax-loader.gif'>")
		$(loading_img).addClass('loading_gif')
		$(where).append(loading_img)
    var send = {
        'img_file' : img_file,
        'project_name': obj.project_name,
        'row_id': obj.id,
        'rect_coords' : rect_coords,
    }
    console.log(send)
    $.ajax({
        url: '../do_grabcut',
        type: 'POST',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        success: function (result) {
            console.log(result)
            file_name = result['saved_file'] 
            //object object.
            obj.canvas2.imageURL = file_name

            append_grabcut_result(file_name, where, div_id)
        },
        error: function (request, status, error) {
          console.log("Error");
          console.log(request)
          console.log(status)
          console.log(error)
        }
    });
}

function append_grabcut_result(file_name, where, div_id) {
    $("#loading_" + div_id).remove()
    var gc_img = $("<img>")
    $(gc_img).attr('src', file_name)
    $(gc_img).addClass('grabcut_res')
    $(where).empty()
    $(where).append(gc_img)
}
