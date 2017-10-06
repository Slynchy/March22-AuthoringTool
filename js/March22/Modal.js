
ModalManager = 
{
    activeModals : []
}

ModalManager.createModal = function(content,callback)
{
    if(!callback) callback = function(){};
    var html = "";
    if(!content)
        html = '<div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <span class="close">&times;</span> </div> </div>';
    else
        html = '<div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <span class="close">&times;</span> ' + content + ' </div> </div>'
    var e = document.createElement('div');
    e.innerHTML = html;
    document.getElementById("body").appendChild(e);
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];


    span.onclick = function() {
        //modal.style.display = "none";
        callback();
        modal.parentNode.removeChild(modal);
    }
}
