function loadResponse(query) {

    $.ajax( {
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Token 8031526c5738ab9ca0de8b9dc7e6a363ba36b84e"
        },
        url: "https://api.esv.org/v3/passage/search/",
        data: {
            "q": query,
            "page-size":100
        },
        error: function() {
            console.log("failure");
        }
    }).done(function(data) {
        console.log(JSON.stringify(data));
        createHTML(query, data);
    });
}

function createHTML(query,json) {

    // Sanitize query for display
    var temp = document.createElement('div');
    temp.textContent = query;
    query = temp.innerHTML;

    var num_results = document.createElement("h2");
    num_results.classList.add("success", "text-success");
    num_results.innerHTML = json["total_results"] + " results for " + '"' + query + '"';
    jumbo.append(num_results);

    var output = document.getElementById('output_stream');

    // if too many results
    if (json["total_pages"]>1) {
        var redir_link = document.createElement("p");
        redir_link.classList.add("redir_err","text-danger");
        redir_link.innerHTML = "Too many results for query. Click <a href=https://www.google.com/search?q=" + query + "+in+the+bible target='_blank'>here</a> for more."
        output.append(redir_link);

    } else {

        var json_data = json["results"];
        for (var i = 0; i < json_data.length; i++) {
            var obj = json_data[i];
            var obj_ref = document.createElement("h3");
            obj_ref.innerHTML = "<a href='https://www.esv.org/" + obj["reference"] + "' target='_blank'>"+obj["reference"]+"</a>";
            var obj_con = document.createElement("p");
            obj_con.innerHTML = obj["content"];

            console.log(obj["reference"]);
            console.log(obj["content"]);

            output.append(obj_ref);
            output.append(obj_con);
        }
    }
}

// browser action in manifest.json tells this to run on click
chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"},
    function(selection) {
        var query_raw_raw = encodeURIComponent(selection[0] || 'during');
        var jumbo = document.getElementById('jumbo');
        console.log(selection);
        if (selection[0]=="") {
            var no_selection = document.createElement("h2");
            no_selection.classList.add("text-danger", "notext-err");
            no_selection.innerHTML = "No text selected";
            jumbo.append(no_selection);
        } else {
            var query_raw = query_raw_raw.replace(/\+/g, ' ');
            try {
                var query = decodeURIComponent(query_raw.trim());
            } catch(e) {
                console.error(e);
                query = query_raw;
            }
        }
        loadResponse(query);
}
);
