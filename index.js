console.log("hello");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
    }
};

xhttp.open("GET", "data.txt", true);
xhttp.send();