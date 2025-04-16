// En lista med kartbilder som används för att uppdatera kartan
const mapImages = [
    "Image/Img1.jpg", "Image/Img2.jpg", "Image/Img3.jpg",
    "Image/Img4.jpg", "Image/Img5.jpg", "Image/Img6.jpg",
    "Image/Img7.jpg", "Image/Img8.jpg", "Image/Img9.jpg",
];

// Spelarens startposition – mittenrutan (rad 1, kolumn 1)
let position = { row: 1, col: 1 };

// Kattens position (slumpas i Start())
let catPosition = { row: 0, col: 0 };

// Zombiens position (slumpas i Start())
let zombiePosition = null;

// Startar spelet och initialiserar kartan, katten och zombien
function Start() {
    // Definiera hörnen på kartan
    const corners = [
        { row: 0, col: 0 }, // uppe vänster
        { row: 0, col: 2 }, // uppe höger
        { row: 2, col: 0 }, // nere vänster
        { row: 2, col: 2 }, // nere höger
    ];

    // Slumpa kattens position till ett av hörnen
    catPosition = corners[Math.floor(Math.random() * corners.length)];

    // Välj zombiens position i ett motsatt hörn från katten
    const oppositeCorners = corners.filter(corner => 
        corner.row !== catPosition.row && corner.col !== catPosition.col
    );
    zombiePosition = oppositeCorners[Math.floor(Math.random() * oppositeCorners.length)];

    // Hämta huvudsektionen och lägg till spelets HTML-struktur
    const main = document.getElementById("Rules");
    main.innerHTML = `
        <h3>Spelet har börjat!</h3>
        <div class="map-container" style="position: relative; width: 300px; height: 300px;">
            <img id="map" src="Image/Img5.jpg" alt="karta" width="300" height="300">
            <img id="cat" src="Image/cat.png" alt="katt"
                style="display: none; position: absolute; width: 80px; height: 80px;">
            <img id="zombie" src="Image/Zombie.png" alt="zombie"
                style="display: none; position: absolute; width: 80px; height: 80px;">
        </div>
        <pre id="map-text"></pre>
        <p id="hint-text" style="color: white; font-style: italic;"></p>
        <p id="quote-text" style="color: white; font-style: italic; margin-top: 10px;"></p>
        <div class="controls">
            <button onclick="move('north')">Nord</button><br>
            <button onclick="move('west')">Väst</button>
            <button onclick="move('east')">Öst</button><br>
            <button onclick="move('south')">Syd</button>
        </div>
    `;

    // Uppdatera kartan med startpositioner
    updateMap();
}

// Uppdaterar kartan och visar katten och zombien på rätt positioner
function updateMap() {
    // Uppdatera kartbilden baserat på spelarens position
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

            // Justera kattens position på kartan
            let left = 0, top = 0;
            if (catPosition.col === 2) left = 220;
            if (catPosition.row === 2) top = 220;

            catImg.style.left = `${left}px`;
            catImg.style.top = `${top}px`;

            // Hämta och visa ett citat från API:et
            fetchQuote();
        } else {
            catImg.style.display = "none";
        }
    }

    // Visa zombien om spelaren är på zombiens ruta
    const zombieImg = document.getElementById("zombie");
    if (zombieImg) {
        if (position.row === zombiePosition.row && position.col === zombiePosition.col) {
            zombieImg.style.display = "block";

            // Justera zombiens position på kartan
            let left = 0, top = 0;
            if (zombiePosition.col === 2) left = 220;
            if (zombiePosition.row === 2) top = 220;

            zombieImg.style.left = `${left}px`;
            zombieImg.style.top = `${top}px`;
        } else {
            zombieImg.style.display = "none";
        }
    }

    // Generera en textbaserad karta
    let output = "";
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (position.row === row && position.col === col) {
                output += "[X]"; // Spelarens position
            } else {
                output += "[ ]"; // Tom ruta
            }
        }
        output += "\n";
    }

    // Visa den textbaserade kartan
    const mapText = document.getElementById("map-text");
    if (mapText) {
        mapText.textContent = output;
    }

    // Visa ledtrådar om spelaren är nära katten
    const distanceToCat = Math.abs(position.row - catPosition.row) + Math.abs(position.col - catPosition.col);
    const hintText = document.getElementById("hint-text");
    if (hintText) {
        if (distanceToCat === 1) {
            hintText.textContent = "Du hör mjauande i närheten!";
        } else {
            hintText.textContent = "";
        }
    }
}

// Hanterar spelarens rörelser och uppdaterar kartan
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

// Hämtar och visar ett citat från API:et när spelaren hittar katten
async function fetchQuote() {
    const quoteText = document.getElementById("quote-text");
    if (quoteText) {
        // Visa en laddningstext medan citatet hämtas
        quoteText.textContent = "Hämtar citat...";
    }

    try {
        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: { 'X-Api-Key': 'jHCKnpEHjGnuo5Kl1qp8Mg==Kf2RJYQrlX0Nc4yE' }
        });
        const data = await response.json();
        if (data.length > 0 && quoteText) {
            quoteText.textContent = `"${data[0].quote}" - ${data[0].author}`;
        }
    } catch (error) {
        if (quoteText) {
            quoteText.textContent = "Kunde inte hämta citat.";
        }
        console.error("Fel vid hämtning av citat:", error);
    }
}