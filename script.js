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
        <li class="pokemon-card" style="background-color: ${color};">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            <h2>${pokemon.name}</h2>
        </li>
    `;
}

loadPokemon();

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

    return colors[type] || "#dddddd";
}