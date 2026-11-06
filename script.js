function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function get_data(event) {
	event.preventDefault();
	let selection = document.getElementById('api-endpoint-types');
	let output = document.getElementById('output');
	let pokeimg = document.getElementById('pokeimg');
	let input = document.getElementById('name-input').value.trim().toLowerCase();
	input = input.replace(/\s+/g, '-');
	pokeimg.src = "";
	pokeimg.style.display = "none";
	if (selection.value === "none") {
		output.textContent = "No criteria selected";
		return;
	}
	if (selection.value !== "none" && input.trim() === "") {
		output.textContent = "No value or id selected";
		return;
	}
	if (selection.value === "pokemon") {
		fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("No pokemon exists with that id or name");
				}
				return response.json();
			})
			.then(data => {
				output.textContent = "";
				output.textContent += `\n#${data.id} ${capitalize(data.name)}\n`;

				output.textContent += `Height: ${data.height / 10} metres\n`;
				output.textContent += `Weight: ${data.weight / 10} kilograms\n`;
				let abilities = data.abilities;
				output.textContent += `Base XP received when defeating ${capitalize(data.name)}: ${data.base_experience}\n`;
				output.textContent += `\nAbilities: `;
				let counter = 0;
				abilities.forEach(item => {
					counter++;
					output.textContent += `${counter}. ${capitalize(item.ability.name)} `;
				});
				let types = data.types;
				output.textContent += `\nTypes: `;
				counter = 0;
				types.forEach(item => {
					counter++;
					output.textContent += `${counter}. ${capitalize(item.type.name)} `;
				})
				let stats = data.stats;
				output.textContent += `\nStats: `;
				stats.forEach(item => {
					output.textContent += `${capitalize(item.stat.name)}: ${item.base_stat}, `;
				})

				if (data?.sprites?.front_default) {
					let pokemon_sprite = data.sprites.front_default;
					pokeimg.src = pokemon_sprite;
					pokeimg.style.display = "block";
				}
				
			})
			.catch(error => {
				console.error(error);
				output.textContent = error.message;
			});
	}
	if (selection.value === "pokemon-species") {
		output.textContent = "";
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${input}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("No pokemon with that name or id");
				}
				return response.json();
			})
			.then(data => {			
				output.textContent += `Name: ${capitalize(data.name)}\n`;
				output.textContent += `Id: ${data.id}\n`;
				output.textContent += `Generation: ${capitalize(data.generation.name)}\n`;

				output.textContent += `\nBase happiness: ${data.base_happiness}\n`;
				output.textContent += `Capture rate: ${data.capture_rate}\n`;
				output.textContent += `\nColor of ${capitalize(data.name)}: ${capitalize(data.color.name)}\n`;

				let egg_group = data.egg_groups;
				output.textContent += `Egg groups: `;
				egg_group.forEach(item => {
					output.textContent += `${capitalize(item.name)} `;	
				})
				output.textContent += `\nShape: ${capitalize(data.shape.name)}\n`;
				output.textContent += `Growth rate: ${capitalize(data.growth_rate.name)}\n`;
				if (data?.habitat?.name) {
					output.textContent += `Habitat: ${capitalize(data.habitat.name)}\n`;	
				}

				let pokedex_entry = data.flavor_text_entries;

				for (let i = 0; i < pokedex_entry.length; i++) {
					if (pokedex_entry[i].language.name === "en") {
						let pokedex_en_text = pokedex_entry[i].flavor_text;
						pokedex_en_text = pokedex_en_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
						output.textContent += `Pokedex entry in Pokemon ${capitalize(pokedex_entry[i].version.name)}: ${pokedex_en_text}`;
						break;
					}
				}
				
			})
			.catch(error => {
				console.error(error);
				output.textContent = error.message;
			});
	}
	if (selection.value === "evolution-chain") {
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${input}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("No pokemon with that name or id");
			}
			return response.json();
		})
		.then(data => {
			output.textContent = "";
			let ev_chain = data.evolution_chain.url;

			return fetch(ev_chain)
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			let branch = [data.chain];
			let names = [];

			while (branch.length > 0) {
				const node = branch.shift();
				names.push(`${capitalize(node.species.name)}`)

				if (node.evolves_to && node.evolves_to.length > 0) {
					for (let i = 0; i < node.evolves_to.length; i++) {
						branch.push(node.evolves_to[i]);
					}
				}
			}
			output.textContent += names.join(" -> ");
		})
		
		.catch(error => {
			console.error(error);
			output.textContent = error.message;
		});
	}
	if (selection.value === "type") {
		output.textContent = "";
		fetch(`https://pokeapi.co/api/v2/type/${input}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("No Attack type exists with that name or id")
				}
				return response.json();
			})
			.then(data => {
				output.textContent += `Name: ${capitalize(data.name)}\n`;
				output.textContent += `Id: ${data.id}\n`;
				output.textContent += `Generation: ${data.generation.name}\n\n`;

				Object.entries(data.damage_relations).forEach(([dmgName, dmgArray]) => { 
          			if (dmgArray.length !== 0) { 

            			output.textContent += `${dmgName.split('_').map(capitalize).join('-')}:  `; 
            
            			dmgArray.forEach(obj => { 
              				output.textContent += `${capitalize(obj.name)}, `; 
            			}); 
            			output.textContent += `\n`;
          			} 
        		});
        		if (data?.move_damage_class?.name) {
        			output.textContent += `\nClass: ${data.move_damage_class.name}`;	
        		}
			})
			.catch(error => {
				console.error(error);
				output.textContent = error.message;
			});
	}
	if (selection.value === "berry") {
		output.textContent = "";
		fetch(`https://pokeapi.co/api/v2/berry/${input}`)
	  		.then(response => {
	    		if (!response.ok) {
	      			throw new Error(`No berry exists with this id or name`);
	    		}
	    		return response.json(); 
	  		})
	  		.then(data => {
	  			if (data.id > 64) {
	  				throw new Error(`${capitalize(data.item.name)} has null properties`);
	  			}
	    		output.textContent += `#${data.id} ${capitalize(data.item.name)}\n`;
	    		output.textContent += `\nFirmness: ${data.firmness.name}\n`;
	    		output.textContent += `Size: ${data.size / 10} cm\n`;
	    		output.textContent += `Growth time: ${data.growth_time} hrs per stage\n`;

	    		output.textContent += `\nGift type: ${capitalize(data.natural_gift_type.name)}\n`;
	    		output.textContent += `Gift power: ${data.natural_gift_power}\n`;

	    		output.textContent += `\nSmoothness: ${data.smoothness}\n`;
	    		output.textContent += `Soil dryness: ${data.soil_dryness}\n`;
	    		output.textContent += `Flavors: \n`;
	    		let flavors = data.flavors;
	    		let counter = 0;
	    		flavors.forEach(item => {
	    			counter++;
	    			output.textContent += `${counter}. Flavor: ${capitalize(item.flavor.name)} (Potency: ${item.potency})\n`;
	    		})
	  		})
	  		.catch(error => {
	  			output.textContent = error.message;
	    		console.error(error);
	  		});
	}
	if (selection.value === "ability") {
		output.textContent = "";
		fetch(`https://pokeapi.co/api/v2/ability/${input}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("No ability with that name or id");
				}
				return response.json();
			})
			.then(data => {
				output.textContent += `#${data.id} ${capitalize(data.name)}\n`;
				output.textContent += `Id: ${data.id}\n`;
				let effect_entry = data.effect_entries;
				for (let i = 0; i < effect_entry.length; i++) {
					if (effect_entry[i].language.name === "en") {
						output.textContent += `Short effect description: ${effect_entry[i].short_effect}\n`;
						output.textContent += `Effect description: ${effect_entry[i].effect}\n\n`;
						break;
					}
				}
				let fte = data.flavor_text_entries;
				for (let j = 0; j < fte.length; j++) {
					if (fte[j].language.name === "en") {
						let text = fte[j].flavor_text;
						let version = fte[j].version_group.name;
						output.textContent += `Pokedex entry in Pokemon ${version.toUpperCase()}: ${text.replaceAll('\n', ' ')}\n`;
						break;
					}
					
				}
				output.textContent += `Pokemon that can have this ability ->\n\n`;
				let poke_ability = data.pokemon;
				let c = 0;
				poke_ability.forEach(item => {
					c++; // OMG C++
					let cleanID = item.pokemon.url.replace(/\/$/, '');
					let pokemonID = cleanID.substring(cleanID.lastIndexOf("/") + 1);
					output.textContent += `${c}. #${pokemonID} ${item.pokemon.name}\n`;
				})
			})
			.catch(error => {
				console.error(error);
				output.textContent = error.message;			
			})
	}
}