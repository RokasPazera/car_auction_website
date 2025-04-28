<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedCar = null;
    export let updateCar;
    let car = selectedCar;

    let brand = car.brand || '';
    let model = car.model || '';
    let year = car.year || '';
    let price = car.price || '';
    let url = car.url || '';
    let time = car.time || '';
    let description = car.description || '';

    let errorMessage = '';
    let isEditing = !!selectedCar;

    const handleSubmit = async () => {
        errorMessage = '';

        if (!brand || !model || !year || !price || !url || !time) {
            errorMessage = 'All fields are required!';
            return;
        }

        if (brand !== 'BMW') {
            if (brand === 'bmw') {
                errorMessage = 'Must be all in capital letters. It is the best car brand after all!';
            } else {
                errorMessage = 'BRAND CAN ONLY BE BMW!!!!!';
            }
            return;
        }

        if (year < 2000) {
            errorMessage = 'Why are you posting a car from dinosaur era??? Post a newer one...(newer than 2000)';
            return;
        }

        if (year > 2024) {
            errorMessage = 'Are you serious??? No way you live in the future!';
            return;
        }

        const carData = {
            brand,
            model,
            year,
            price,
            url,
            time,
            description
        };

        if (isEditing) {
            updateCar(carData);
        } else {
            try {
                const response = await fetch('http://localhost:3000/cars', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(carData),
                });

                const data = await response.json();

                if (response.ok) {
                    dispatch('addCar', data);
                    resetForm();
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        brand = '';
        model = '';
        year = '';
        price = '';
        url = '';
        time = '';
        description = '';
        errorMessage = '';
        isEditing = false;
    };
</script>

<div class="p-6 rounded-lg bg-gray-800 text-white">
    <h2 class="text-2xl font-bold mb-4">{isEditing ? 'Edit Car' : 'Add a New Car'}</h2>

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}

        <div>
            <label>Brand:</label>
            <input
                type="text"
                bind:value={brand}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>Model:</label>
            <input
                type="text"
                bind:value={model}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>Year:</label>
            <input
                type="number"
                bind:value={year}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>Price:</label>
            <input
                type="number"
                bind:value={price}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>URL:</label>
            <input
                type="text"
                bind:value={url}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>Auction End Date & Time:</label>
            <input
                type="datetime-local"
                bind:value={time}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div>
            <label>Description:</label>
            <textarea
                bind:value={description}
                class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            ></textarea>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
        >
            {isEditing ? 'Update Car' : 'Post!'}
        </button>

        {#if isEditing}
            <button
                type="button"
                on:click={resetForm}
                class="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition duration-300 mt-2"
            >
                Cancel
            </button>
        {/if}
    </form>
</div>

<style>
    input[type="number"] {
        -moz-appearance: textfield;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
