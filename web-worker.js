let currentPixels = null;

function getIndex(x, y, width) {
    return (x + y * width) * 4;
}

function clamp(value) {
    return Math.max(0, Math.min(Math.floor(value), 255));
}

const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

// function addRed(x, y, value){
//     const index = getIndex(x,y) + R_OFFSET;
//     const currentValue = currentPixels[index];
//     currentPixels[index] = clamp(currentValue + value);
// }

// function addGreen(x, y, value){
//     const index = getIndex(x,y) + G_OFFSET;
//     const currentValue = currentPixels[index];
//     currentPixels[index] = clamp(currentValue + value);
// }

// function addBlue(x, y, value){
//     const index = getIndex(x,y) + B_OFFSET;
//     const currentValue = currentPixels[index];
//     currentPixels[index] = clamp(currentValue + value);
// }

function addContrast(x, y, value, width) {
    const redIndex = getIndex(x, y, width) + R_OFFSET
    const greenIndex = getIndex(x, y, width) + G_OFFSET
    const blueIndex = getIndex(x, y, width) + B_OFFSET
  
    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]
  
    const alpha = (value + 255) / 255 
  
    const nextRed = alpha * (redValue - 128) + 128
    const nextGreen = alpha * (greenValue - 128) + 128
    const nextBlue = alpha * (blueValue - 128) + 128
  
    currentPixels[redIndex] = clamp(nextRed)
    currentPixels[greenIndex] = clamp(nextGreen)
    currentPixels[blueIndex] = clamp(nextBlue)
}

function processImage(originalPixels, imgData, width, height) {
    currentPixels = originalPixels.slice();
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            addContrast(j, i, 200, width);
        }
    }
    
    for(let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = currentPixels[i];
    }
    postMessage(imgData);
}

onmessage = function(event){
    if(event.data[0] !== null && event.data[1] !== null && event.data[2] !== null && event.data[3] !== null){
        processImage(event.data[0], event.data[1], event.data[2], event.data[3]);
    }
}

