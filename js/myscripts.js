function mmmchangeMyBackground(){
    var colorValue = document.getElementById("html5colorpicker").value;
    document.documentElement.style.setProperty('--primary', colorValue);
};

function focuseandor(){
    var focused = document.activeElement.img;
    focused.src="assets/logos/link.png";
}