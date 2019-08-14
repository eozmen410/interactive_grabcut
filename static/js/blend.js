function add_blend_button(){
    $("#add_blend_button").click(function(){
        let row1_id = $("#blend_row_1").val()
        let row2_id = $("#blend_row_2").val()
        console.log(row1_id, row2_id)

        makeBlendRow(appending_container, project_name, row1_id, row2_id)
    })
}

function getBlendingCanvasId(id, canvas_num){
    return "blending_"+id+"_canvas_"+canvas_num
}

function makeBlendRow(appending_container, project_name, url1, url2){
    console.log(appending_container)
    console.log(project_name)
    console.log(url1)
    console.log(url2)

    let id = getIdNumber()

    let obj = {
        id: id,
        row_type: "blending",
        project_name: project_name,
        
        canvas1: {},
        //canvas2: {},
        //canvas3: {},
      }

    // UI FRAMEWORK STUFF
    let new_row = $("<div class='row'>")
    $(new_row).attr("id", id)
    let col1 = $("<div class='col-md-4'>")
    let col2 = $("<div class='col-md-4'>")
    let col3 = $("<div class='col-md-4'>")

    $(new_row).append(col1).append(col2).append(col3)      
    $("#"+appending_container).append(new_row)

    console.log("HERE")
        //CREATE ROW 1 (Fabric cancas for drawing)
    let canvas1_id = getBlendingCanvasId(id, "1")
    obj.canvas1 = {
        type: "fabric_canvas",            
        id: canvas1_id,
        // height : canvas_height,
        // width: canvas_width,
        imageURL: "",
        scale_factor: 1, //default of no scaling factor
        img_height: "",
        img_width: "",
        original_image: "",

    }

    let blending_canvas = makeBlendingFabricCanvas(obj.canvas1, col1)



}

function makeBlendingFabricCanvas(myCanvasObj, appendToCol, url1, url2){
    let canvas1_id = myCanvasObj.id
    myCanvasObj.ready = false;
    let canvas_html = $("<canvas>")        
    $(canvas_html).attr("id", myCanvasObj.id)
    $(canvas_html).attr("height", canvas_height)
    $(canvas_html).attr("width", canvas_width)
    $(appendToCol).append(canvas_html) 


    //create fabric canvas
    var canvas = new fabric.Canvas(canvas1_id);

    fabric.Image.fromURL(url1, function(myImg) {
     canvas.add(myImg); 
    });

    return canvas

}