const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"), 
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// global variable with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () => {
    //setting whole canvas background to white, so download img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillStyle back to the selected color, it'll be the brush color
} 

window.addEventListener("load", () => {
    //sets canvas width/height returns viewable width/height of an element 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        //creating circle according to mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}       

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    //getting radius for circle according to mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, 50, 0, 2 * Math.Pi); //creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle 
}

const drawTriangle = (e) => {
    ctx.beginPath(); //creating line path to draw triangle 
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);//creating first line according to moue pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle 
    ctx.closePath(); //closing path of triangle so 3rd line draws automatically. 
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillColor is checked fill triangle else draw border triangle
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouse x position as prevMouseX value 
    prevMouseY = e.offsetY;
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; //passing brush size as line width
    ctx.strokeStyle = selectedColor; //passes selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passes selectedColor as fill style
    // copying canvas data & passing as snapshot value .. which avoids dragging img 
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; //if is drawing is false return from here 
    ctx.putImageData(snapshot, 0, 0); //adds copied canvas data to this canvas   
    
    //if selected tool is eraser then set strokeStyle to white
    // to paint white color on the existing canvas content else set the stroke color to selected color
    if(selectedTool === "brush" || selectedTool === "eraser" ) { 
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); //creating line according to mouse pointer
    ctx.stroke(); // drawing/filling line with color 
} else if (selectedTool === "rectangle"){
    drawRect(e);
} else if (selectedTool === "circle"){
    drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool options 
        //removing active from previous option and adding on current clicked on button
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
    })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);// passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click to all color button
         //removing active from previous option and adding on current clicked on button
         document.querySelector(".options .selected").classList.remove("selected");
         btn.classList.add("selected");
         // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    //passes picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

//clearing the whole canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); //creating <a> element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value 
    link.click(); //clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing); //allows mouse to move
canvas.addEventListener("mouseup", () => isDrawing = false);
