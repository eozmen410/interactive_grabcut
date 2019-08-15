$(document).ready(function(){
    console.log('doc ready')
    all_rows = {} // id: objc
    appending_container = "appending_container"

    project_name_1 = "burger"
    let obj1 = makeGrabCutRow(appending_container, "../static/images/burger/_original/burger.jpg", project_name_2)
    let obj1_id = obj1.id
    all_rows[obj1_id] = obj1

    project_name_2 = "chess"
    let obj2 = makeGrabCutRow(appending_container, "../static/images/chess/_original/test_chess.jpeg", project_name_3)
    let obj2_id = obj2.id
    all_rows[obj2_id] = obj2

})