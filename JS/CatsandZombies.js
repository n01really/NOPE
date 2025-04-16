const mapImages = [
    "Image/Img1.jpg", "Image/Img2.jpg", "Image/Img3.jpg",
    "Image/Img4.jpg", "Image/Img5.jpg", "Image/Img6.jpg",
    "Image/Img7.jpg", "Image/Img8.jpg", "Image/Img9.jpg",
];

// Spelarens startposition – mittenrutan (rad 1, kolumn 1)
let position = { row: 1, col: 1 };

// Kattens position (slumpas i Start())
let catPosition = { row: 0, col: 0 };

function Start() {
    // Slumpa ett av hörnen
    const corners = [
        { row: 0, col: 0 }, // uppe vänster
        { row: 0, col: 2 }, // uppe höger
        { row: 2, col: 0 }, // nere vänster
        { row: 2, col: 2 }, // nere höger
    ];
    catPosition = corners[Math.floor(Math.random() * corners.length)];

    const main = document.getElementById("Rules");

    // Lägg in karta och kontroller
    main.innerHTML = `
        <h3>Spelet har börjat!</h3>
        <div class="map-container" style="position: relative; width: 300px; height: 300px;">
            <img id="map" src="Image/Img5.jpg" alt="karta" width="300" height="300">
            <img id="cat" src="Image/cat.png" alt="katt"
                style="display: none; position: absolute; width: 80px; height: 80px;">
        </div>
        <pre id="map-text"></pre>
        <div class="controls">
            <button onclick="move('north')">Nord</button><br>
            <button onclick="move('west')">Väst</button>
            <button onclick="move('east')">Öst</button><br>
            <button onclick="move('south')">Syd</button>
        </div>
    `;

    updateMap();
}

// Uppdaterar kartan och visar katten om spelaren är på kattens ruta
function updateMap() {
    const index = position.row * 3 + position.col;
    const mapImg = document.getElementById("map");
    if (mapImg) {
        mapImg.src = mapImages[index];
    }

    // Visa katten om spelaren är på kattens ruta
    const catImg = document.getElementById("cat");
    if (catImg) {
        if (position.row === catPosition.row && position.col === catPosition.col) {
            catImg.style.display = "block";

            // Justera position utifrån vilket hörn katten är i
            let left = 0, top = 0;
            if (catPosition.col === 2) left = 220;
            if (catPosition.row === 2) top = 220;

            catImg.style.left = `${left}px`;
            catImg.style.top = `${top}px`;
        } else {
            catImg.style.display = "none";
        }
    }

    // Textbaserad karta
    let output = "";
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (position.row === row && position.col === col) {
                output += "[X]";
            } else {
                output += "[ ]";
            }
        }
        output += "\n";
    }

    const mapText = document.getElementById("map-text");
    if (mapText) {
        mapText.textContent = output;
    }
}

// Spelarkontroller
function move(direction) {
    switch (direction) {
        case "north":
            if (position.row > 0) position.row--;
            break;
        case "south":
            if (position.row < 2) position.row++;
            break;
        case "west":
            if (position.col > 0) position.col--;
            break;
        case "east":
            if (position.col < 2) position.col++;
            break;
    }
    updateMap();
}