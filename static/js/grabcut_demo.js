$(document).ready(function(){
    console.log('doc ready')
    all_rows = {} // id: objc
    appending_container = "appending_container"
    project_name = "acorn_gh"
    
    let obj1 = makeGrabCutRow(appending_container, "../static/images/acorn_gh/_original/gh.jpg", project_name)
    let obj1_id = obj1.id
    all_rows[obj1_id] = obj1

    let obj2 = makeGrabCutRow(appending_container, "../static/images/acorn_gh/_original/acorn.jpg", project_name)
    let obj2_id = obj2.id
    all_rows[obj2_id] = obj2

    project_name_2 = "burger"
    let obj3 = makeGrabCutRow(appending_container, "../static/images/burger/_original/burger.jpg", project_name_2)
    let obj3_id = obj3.id
    all_rows[obj3_id] = obj3

})