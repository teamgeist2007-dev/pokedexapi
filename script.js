let allPokemon = [];
let currentPokemonIndex = 0;

async function loadPokemon() {
    const button = document.getElementById("load-more-button");
    if (button.disabled || allPokemon.length >= 1025) return;
    setLoading(true);
    try {
        await loadNextPokemon();
        renderPokemon();
    } catch (error) {
        document.getElementById("loading").innerText =
            "Laden fehlgeschlagen. Bitte erneut versuchen.";
    } finally {
        setLoading(false);
    }
}

async function loadNextPokemon() {
    const firstId = allPokemon.length + 1;
    const lastId = Math.min(firstId + 19, 1025);
    let newPokemon = [];

    for (let pokemonId = firstId; pokemonId <= lastId; pokemonId++) {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon/" + pokemonId
        );
        if (!response.ok) throw new Error("Laden fehlgeschlagen");
        newPokemon.push(await response.json());
    }
    allPokemon.push(...newPokemon);
}

function setLoading(isLoading) {
    const button = document.getElementById("load-more-button");

    button.disabled = isLoading || allPokemon.length >= 1025;
    button.innerText = isLoading ? "Pokémon werden geladen..." : "Weitere 20 laden";

    if (isLoading) {
        document.getElementById("loading").innerText = "";
    }

    if (allPokemon.length >= 1025) {
        button.innerText = "Alle Pokémon geladen";
    }
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
                style="background-color: ${color};">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
                <h2>${pokemon.name}</h2>
            </button>
        </li>
    `;
}

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

function openDialog(indexPokemon) {
    currentPokemonIndex = indexPokemon;
    const pokemon = allPokemon[indexPokemon];
    const dialog = document.getElementById("pokemon-dialog");

    document.getElementById("dialog-content").innerHTML =
        dialogTemplate(pokemon);

    if (!dialog.open) {
        dialog.showModal();
    }

    document.body.style.overflow = "hidden";
}

function dialogTemplate(pokemon) {
    return `
        <img class="dialog-image" src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}" />
        <h2>${pokemon.name}</h2>
        <p>Typ: ${getPokemonTypes(pokemon)}</p>
        <p>Größe: ${pokemon.height / 10} m</p>
        <p>Gewicht: ${pokemon.weight / 10} kg</p>
        <h3>Basiswerte</h3>
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

function previousPokemon() {
    let indexPokemon = currentPokemonIndex - 1;

    if (indexPokemon < 0) {
        indexPokemon = allPokemon.length - 1;
    }

    openDialog(indexPokemon);
}

function nextPokemon() {
    let indexPokemon = currentPokemonIndex + 1;

    if (indexPokemon >= allPokemon.length) {
        indexPokemon = 0;
    }

    openDialog(indexPokemon);
}

loadPokemon();


// Suchleiste soll mit den ersten 3 buchstaden schon passende Pokemon anzeigen

// mit Ladebutton soll man mehr Pokemon im Dex einblenden können