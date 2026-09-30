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
    return `
        <li class="pokemon-card">
            <img
                src="${allPokemon[indexPokemon].sprites.front_default}"
                alt="${allPokemon[indexPokemon].name}"
            />
            <h2>${allPokemon[indexPokemon].name}</h2>
        </li>
    `;
}

loadPokemon();