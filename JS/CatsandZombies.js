// Lagra kartbilder (lägg bilder i en mapp som heter "images")
const mapImages = [
    "images/img0.jpg", "images/img1.jpg", "images/img2.jpg",
    "images/img3.jpg", "images/img4.jpg", "images/img5.jpg",
    "images/img6.jpg", "images/img7.jpg", "images/img8.jpg"
];

// Spelarens startposition – mittenrutan (rad 1, kolumn 1)
let position = { row: 1, col: 1 };

function Start()
{
    const main = document.getElementById("Rules");

    // Ersätt innehållet i <main> med spelet
    main.innerHTML = `
        <h3>Spelet har börjat!</h3>
        <img id="map" src="images/img4.jpg" alt="karta" width="300" height="300">
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

// Uppdaterar bilden baserat på spelarens position
function updateMap() {
    const index = position.row * 3 + position.col;
    const mapImg = document.getElementById("map-img");
    if (mapImg) {
        mapImg.src = mapImages[index];
    }

    // Skapa textbaserad karta
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

// Hanterar rörelser
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