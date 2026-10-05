let allPokemon = [];
let currentPokemonIndex = 0;

async function loadPokemon() {
    const button = document.getElementById("load-more-button");
    if (button.disabled) return;
    setLoading(true);
    try {
        await loadNextPokemon();
    } catch (error) {
        document.getElementById("loading").innerText =
            "Laden fehlgeschlagen. Bitte erneut versuchen.";
    }
    renderPokemon();
    setLoading(false);
}

async function loadNextPokemon() {
    const firstId = allPokemon.length + 1;
    const lastId = firstId + 19;

    for (let pokemonId = firstId; pokemonId <= lastId && pokemonId <= 1025; pokemonId++) {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon/" + pokemonId
        );
        if (!response.ok) {
            throw new Error("Laden fehlgeschlagen");
        }
        const pokemon = await response.json();
        allPokemon.push(pokemon);
    }
}

function setLoading(isLoading) {
    const button = document.getElementById("load-more-button");
    document.getElementById("loading-animation").hidden = !isLoading;
    button.disabled = isLoading;
    if (isLoading) {
        button.innerText = "Pokémon werden geladen...";
        document.getElementById("loading").innerText = "";
    } else {
        button.innerText = "Weitere 20 laden";
    }
    if (allPokemon.length >= 1025) {
        button.disabled = true;
        button.innerText = "Alle Pokémon geladen";
    }
}

function filterPokemon() {
    const search = document.getElementById("search-input").value.toLowerCase();

    if (search.length < 3) {
        return allPokemon;
    }

    const result = allPokemon.filter(function (pokemon) {
        return pokemon.name.includes(search);
    });

    return result;
}

function renderPokemon() {
    const containerRef = document.getElementById("pokemon-list");
    const result = filterPokemon();
    let html = "";

    for (let i = 0; i < result.length; i++) {
        const indexPokemon = allPokemon.indexOf(result[i]);
        html += pokemonCard(indexPokemon);
    }

    if (result.length === 0 && allPokemon.length > 0) {
        html = noPokemonTemplate();
    }
    containerRef.innerHTML = html;
}

function noPokemonTemplate() {
    return `
        <li class="no-pokemon">
            Keine Pokémon unter dieser Suche gefunden.
        </li>
    `;
}

function pokemonCard(indexPokemon) {
    const pokemon = allPokemon[indexPokemon];
    const color = getPokemonColor(pokemon.types[0].type.name);

    return `
        <li>
            <button class="pokemon-card" onclick="openDialog(${indexPokemon})"
                style="background-color: ${color};">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${pokemon.name}</h2>
                <p>${getPokemonTypes(pokemon)}</p>
            </button>
        </li>
    `;
}

function getPokemonColor(type) {
    const colors = {
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
    if (colors[type]) return colors[type];
    return "#dddddd";
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
            alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Typ: ${getPokemonTypes(pokemon)}</p>
        <p>Größe: ${pokemon.height / 10} m</p>
        <p>Gewicht: ${pokemon.weight / 10} kg</p>
        <h3>Basiswerte</h3>
        <ul class="stats-list">${statsTemplate(pokemon)}</ul>
    `;
}

function getPokemonTypes(pokemon) {
    let types = "";

    for (let i = 0; i < pokemon.types.length; i++) {
        if (i > 0) {
            types += ", ";
        }
        types += pokemon.types[i].type.name;
    }

    return types;
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
}

function closeOutside(event) {
    const dialog = document.getElementById("pokemon-dialog");
    const position = dialog.getBoundingClientRect();

    if (event.clientX < position.left ||
        event.clientX > position.right ||
        event.clientY < position.top ||
        event.clientY > position.bottom) {
        closeDialog();
    }
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
