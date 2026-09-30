let allPokemon = [];

async function loadPokemon() {
    for (let pokemonId = 1; pokemonId <= 20; pokemonId++) {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon/" + pokemonId
        );
        const pokemon = await response.json();
        allPokemon.push(pokemon);
    }

    renderPokemon();
    document.getElementById("loading").innerHTML = "";
}

function renderPokemon() {
    const containerRef = document.getElementById("pokemon-list");
    let html = "";

    for (let indexPokemon = 0; indexPokemon < allPokemon.length; indexPokemon++) {
        html += pokemonCard(indexPokemon);
    }

    containerRef.innerHTML = html;
}

function pokemonCard(indexPokemon) {
    const pokemon = allPokemon[indexPokemon];
    const type = pokemon.types[0].type.name;
    const color = getPokemonColor(type);

    return `
        <li>
            <button class="pokemon-card" onclick="openDialog(${indexPokemon})"
                style="background-color: ${color};"
                aria-label="Show details for ${pokemon.name}">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                <h2>${pokemon.name}</h2>
            </button>
        </li>
    `;
}

loadPokemon();

function getPokemonColor(type) {
    let colors = {
        grass: "#a8d5a2",
        fire: "#f5b18b",
        water: "#9ac7eb",
        bug: "#c5d98b",
        normal: "#d6d6c2",
        poison: "#c9a1d9",
        electric: "#f5df87",
        ground: "#dfc79c",
        fairy: "#efbfd5"
    };

    return colors[type] || "#dddddd";
}

// pokemon im dialogfenser öffnen mit den details
function openDialog(indexPokemon) {
    const pokemon = allPokemon[indexPokemon];
    const dialog = document.getElementById("pokemon-dialog");

    document.getElementById("dialog-content").innerHTML =
        dialogTemplate(pokemon);

    dialog.showModal();
    document.body.style.overflow = "hidden";
}

function dialogTemplate(pokemon) {
    return `
        <img class="dialog-image" src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}" />
        <h2>${pokemon.name}</h2>
        <p>Type: ${getPokemonTypes(pokemon)}</p>
        <p>Height: ${pokemon.height / 10} m</p>
        <p>Weight: ${pokemon.weight / 10} kg</p>
        <h3>Base stats</h3>
        <ul class="stats-list">${statsTemplate(pokemon)}</ul>
    `;
}

function getPokemonTypes(pokemon) {
    let types = [];

    for (let i = 0; i < pokemon.types.length; i++) {
        types.push(pokemon.types[i].type.name);
    }

    return types.join(", ");
}

function statsTemplate(pokemon) {
    let html = "";

    for (let i = 0; i < pokemon.stats.length; i++) {
        const stat = pokemon.stats[i];
        html += `<li>${stat.stat.name}: ${stat.base_stat}</li>`;
    }

    return html;
}

function closeDialog() {
    document.getElementById("pokemon-dialog").close();
    document.body.style.overflow = "";
}


// Suchleiste soll mit den ersten 3 buchstaden schon passende Pokemon anzeigen

// mit Ladebutton soll man mehr Pokemon im Dex einblenden können