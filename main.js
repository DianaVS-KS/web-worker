function spin() {
    const spinner = document.getElementById("spinner");
    let angle = 0;
    setInterval(()=>{
        angle++;
        spinner.style.transform = `rotate(${angle}deg)`;
    },20);
}

spin();

const fileinput = document.getElementById("fileinput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const srcImage = new Image();

let imgData = null;
let originalPixels = null;

fileinput.onchange = function (e) {
    if(e.target.files && e.target.files.item(0)) {
        srcImage.src = URL.createObjectURL(e.target.files[0]);
    }
};

srcImage.onload = function () {
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
    ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
    imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
    originalPixels = imgData.data.slice();
}

const imageWorker = new Worker('/web-worker.js');

imageWorker.onmessage = function (event) {
    const img = event.data;    
    ctx.putImageData(img, 0, 0, 0, 0, srcImage.width, srcImage.height);
}

function startProcessImage () {
    imageWorker.postMessage([originalPixels, imgData, srcImage.width, srcImage.height]);
}