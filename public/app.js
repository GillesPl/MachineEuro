(function() {
    function loadJSON(src, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', src, true);
        
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    var collect = false;
    document.querySelector(".start").addEventListener("click" , function(e) {
        e.preventDefault();
        collect = true;
    })
    document.querySelector(".stop").addEventListener("click" , function(e) {
        e.preventDefault();
        collect = false;
    })

    var x = 0;
    setInterval(function(){ 
        if(collect) {            
            loadJSON("./getEuropilot", function(data) {
                //console.log(x ,JSON.parse(data));
            })
            x++;
        }  
    }, 100);

    
})()