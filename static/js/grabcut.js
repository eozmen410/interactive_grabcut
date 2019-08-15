canvas_height = 300
canvas_width = 300

function getIdNumber(){
    let x = Math.floor((Math.random() * 10000) );
    if(x<1000){
        x=x+1000 
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
        grabCutRefinement_Add(canvas_3_add, obj, canvas4_id, obj.image.original_image)
    })

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


    //set Background Images for the Fabric Canvases     
    fabric.Image.fromURL(myCanvasObj.imageURL, function(img) {
        let original_height = img._originalElement.height
        let original_width = img._originalElement.width

        let scale_determine = original_height > original_width ? original_height : original_width
        let scale_factor = 300/scale_determine    //original_width

        myCanvasObj.scale_factor = scale_factor

        //obj.image.img = fabric.util.object.clone(img)
        myCanvasObj.img_height = original_height * scale_factor
        myCanvasObj.img_width = original_width * scale_factor

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), { 
           scaleX: scale_factor,
           scaleY: scale_factor,
           
        });

     });



    return canvas
}

function makeGrabCutRow(appending_container,imageURL, project_name) {

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
        canvas2: {}, //result of first canvas
        refinement_canvas: {},
        refinement_output: {} //to store the output file name after grabcut

        }

    // CREATE FRAMRWORK FOR ALL CANVASES 
    let new_row = $("<div class='row grabcut_row'>")
    let col1 = $("<div class='col-md-3'>")
    let col2 = $("<div class='col-md-3'>")
    let col3 = $("<div class='col-md-3'>")
    let col4 =$("<div class='col-md-3'>")

    $(new_row).append(col1).append(col2).append(col3).append(col4)     
    $("#"+appending_container).append("Row id: "  +id + " Grabcut outputs for this row can be found in the directory demo_grabcut/static/images/~project_name~/" + id )
    $("#"+appending_container).append(new_row)


    let title_container = $("<div class='col-md-12'>")
    let title_row = $("<div class='row'>")
    let title1 = $("<div class='col-md-3'>")
    let title2 = $("<div class='col-md-3'>")
    let title3 = $("<div class='col-md-3'>")
    let title4 =$("<div class='col-md-3'>")
    $(title1).append("<div class='title'>Draw Rectangle for grabcut (init_w_rect) <br> Make sure to get all the foreground in the rectangle</div>")
    $(title2).append("<div class='title'>Result of grabcut with rectangle:</div>")
    $(title3).append("<div class='title'>Remove background from image by drawing on the paces that are background</div>")
    $(title4).append("<div class='title'>Result of refinement: </div>")
    $(title_row).append(title1).append(title2).append(title3).append(title4)
    $(title_container).append(title_row)
    $(new_row).prepend(title_container)

    //CREATE ROW 1 (Fabric cancas for drawing)
    let canvas1_id = getGrabcutCanvasId(id, "1")
    obj.canvas1 = {
        type: "fabric_canvas",            
        id: canvas1_id,
        imageURL: imageURL,
        scale_factor: 1, //default of no scaling factor
        img_height: "",
        img_width: "",
        original_image: "",

    }


    $


    var fg_fabric_canvas = makeProbableForegroundFabricCanvas(obj.canvas1, col1 /*append to col1 */)

    let do_grabcut_button = $("<button class='btn btn-primary'>Run grabcut &nbsp <span class= 'glyphicon glyphicon-scissors'></span></button>")
    $(col1).append(do_grabcut_button)
    $(do_grabcut_button).click(function(){ 
        if(!obj.canvas1.ready){
            alert("Please draw a rectangle")
            return
        }

        var rect_1 = get_active_rect_of_canvas(fg_fabric_canvas)
        rect_1.scale_factor = obj.canvas1.scale_factor

        let row_id = id        
        do_grabcut_backend(imageURL.replace("../static/images/", ""),  rect_1 , col2, appending_container, obj)

    })

    let canvas2_id = getGrabcutCanvasId(id, "2")

    obj.canvas2 = {
        type: "fabric_canvas",            
        id: canvas2_id,
        imageURL: imageURL,
        scale_factor: 1, //default of no scaling factor
        img_height: "",
        img_width: "",
        original_image: "",
    }

    obj.refinement_canvas = {
        type: "fabric_canvas",            
        id: canvas2_id,
        imageURL: imageURL,
        scale_factor: 1, //default of no scaling factor
        img_height: "",
        img_width: "",
        original_image: "",
    }
    


    let bg_drawing_canvas = makeBackgroundDrawingFabricCanvas(obj.refinement_canvas, col3)

        let add_back_detail_button = $("<button class='btn btn-primary'>Run grabcut refinmenet</button>")
        $(col3).append(add_back_detail_button)
        $(add_back_detail_button).click(function(){
            //error checking for when there's no rectangle drawn on the first canvas
            if(!obj.canvas1.ready){

                alert("Please draw a rectangle first")
                return
            } 
            var rect_1 = get_active_rect_of_canvas(fg_fabric_canvas)
            rect_1.scale_factor = obj.canvas1.scale_factor
    
            refine_grabcut(imageURL.replace("../static/images/", ""),bg_drawing_canvas, obj, rect_1, col4, appending_container)
        })

        let clear_canvas_button = $("<button class='btn btn-primary'>Clear Drawing</button>")
        $(col3).append("<span>&nbsp&nbsp&nbsp&nbsp</span>").append(clear_canvas_button)
        $(clear_canvas_button).click(function(){ 
           clear_canvas(bg_drawing_canvas)
        })

    return obj
}

function refine_grabcut(img_file, drawing_canvas, obj, rect_coords, where, div_id) {
    $(where).empty()
    var loading_img = $("<div id='loading_2_" +div_id +"'>")
    $(loading_img).append("<img src='../static/ajax-loader.gif'>")
    $(loading_img).addClass('loading_gif')
    $(where).append(loading_img)
    //get objects from drawing canvas, send paths to backend
    let lines = drawing_canvas.getObjects()
    var drawing = {
        'lines' : lines,
        'scale_factor' : obj.refinement_canvas.scale_factor,
        'thickness' : 1
    }
    var send = {
        'drawing' : drawing,
        'img_file' : img_file,
        'rect_coords' : rect_coords,
        'project_name': obj.project_name,
        'row_id': obj.id,
    }
    $.ajax({
        url: '../refine_grabcut',
        type: 'POST',
        data: JSON.stringify(send),
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        success: function (result) {
            file_name = result['saved_file']
            $("#loading_2_" + div_id).remove()
            append_grabcut_result(file_name, where, div_id)
            obj.refinement_output.imageURL = file_name
        },
        error: function (request, status, error) {
          console.log("Error");
          console.log(request)
          console.log(status)
          console.log(error)
        }
    });
}

function get_active_rect_of_canvas(fabric_canvas) {
    let active = fabric_canvas.getActiveObject()
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

function clear_canvas(canvas) {
    var objects = canvas.getObjects()
    for(var i=0; i<objects.length; i++){
        canvas.remove(objects[i])
    }
}
