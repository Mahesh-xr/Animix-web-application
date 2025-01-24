
function hide(event){
    event.preventDefault();
    document.querySelector('.sidebar').classList.toggle('active');
}
document.querySelector(".nav-icon").addEventListener('click', function(event){
    hide(event);
})

document.querySelector('.cancel-icon').addEventListener('click', function(event){
    hide(event);
})