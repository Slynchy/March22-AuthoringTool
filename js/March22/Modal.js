ModalManager = function()
{

}

ModalManager.createModal = function()
{
    var html = '<div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <span class="close">&times;</span><input id="projectLoadButton" type="file" onchange="HandleFiles();" title="Select Script Files"> </div> </div>';
    var e = document.createElement('div');
    e.innerHTML = html;
    document.getElementById("body").appendChild(e);
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];


    span.onclick = function() {
        modal.style.display = "none";
    }
}

window.addEventListener("keypress", ModalManager.createModal);