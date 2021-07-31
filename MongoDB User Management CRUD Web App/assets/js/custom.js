$("#add-user").submit(function(event) {
    alert("User added to database!")
})

$("#update-user").submit(function(event) {
    event.preventDefault()

    var unindexedArray = $(this).serializeArray()
    
    var data = {}
    $.map(unindexedArray, function(n, i) {
        data[n["name"]] = n["value"]
    })

    var request = {
        "url": `http://localhost:60/edit/${data.id}`,
        "method": "PUT",
        "data": data
    }
    $.ajax(request).done(function(response) {
        alert("User data updated in database!")
    })
})

if(window.location.pathname == '/') {
    $onDelete = $("table tbody td a.delete")
    $onDelete.click(function() {
        var id  = $(this).attr("data-id")

        var request = {
            "url": `http://localhost:60/remove/${id}`,
            "method": "DELETE"
        }
        if(confirm("Do you really want to delete this user?")) {
            $.ajax(request).done(function(response) {
                alert("User data deleted from database!")
                location.reload()
            })
        }  
    })
}