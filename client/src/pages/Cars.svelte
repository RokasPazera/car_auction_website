<script>
    import TailwindCss from "../lib/TailwindCSS.svelte";
    import Filter from "../components/Filter.svelte";
    import EditCar from "../components/EditCar.svelte";
    import {onDestroy} from "svelte";
    import {userStore} from '../stores/userStores.js';
    import {tokenStore} from '../stores/authStore.js';
    import Page from 'page';


    const API_URL = "http://localhost:3000/cars";

    export let currentParams;
    let token;

    tokenStore.subscribe(value => {
        token = value;
    })

    export let addMoreCars = false;
    export let cars = [];
    let allCars = [];
    let editCarMode = false;
    let carToEdit = null;

    let user = {id: null, username: '', email: '', isAdmin: false};

    let selectedCar = null;

    let loading = false;
    let searchTimeout;
    let page = 1;
    let pageSize = 10;


    const minYearOptions = Array.from({length: 25}, (_, i) => 2000 + i);
    const maxYearOptions = Array.from({length: 25}, (_, i) => 2000 + i);

    let brands = [];
    let models = [];
    let years = [];

    let selectedBrand = '';
    let selectedModel = '';
    let selectedYear = '';
    let searchQuery = '';

    let newCar = {};
    let currentTime = {};


    let endTime;


    $: filteredCars = cars.filter(car => {
        const searchLower = searchQuery.toLowerCase();
        return (
            car.brand.toLowerCase().includes(searchLower) ||
            car.model.toLowerCase().includes(searchLower)
        );
    })
        .filter(car => {
            return (
                (selectedBrand === '' || car.brand === selectedBrand) &&
                (selectedModel === '' || car.model === selectedModel) &&
                (selectedYear === '' || car.year === selectedYear)
            );
        });

    $: paginatedCars = filteredCars.slice((page - 1) * pageSize, page * pageSize);

    function refreshList() {
        loading = true;
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                cars = data.map(car => ({
                    ...car
                }));
                allCars = cars;
                brands = [...new Set(cars.map(car => car.brand))];
                models = [...new Set(cars.map(car => car.model))];
                years = [...new Set(cars.map(car => car.year))];
            })
            .catch((err) => console.error("Error fetching cars: ", err))
            .finally(() => {
                startTimer();
                loading = false
            });
    }

    const showCarDetails = (car) => {
        Page(`/cars/${car.id}`);
    };

    $: if (cars.length === 0 && !loading) {
        refreshList();
    }

    const deleteCar = (id) => {
        console.log("Car id", id)
        console.log("Token", token)
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then((response) => response.json())
            .then(() => {
                refreshList();
            })
            .catch((err) => console.error("Error deleting car", err));
    };

    const handleFilterChange = (event) => {
        const {selectedBrand, selectedModel, minYear, maxYear} = event.detail;

        cars = allCars.filter(car => {
            return (
                (selectedBrand ? car.brand === selectedBrand : true) &&
                (selectedModel ? car.model === selectedModel : true) &&
                (minYear ? car.year >= parseInt(minYear) : true) &&
                (maxYear ? car.year <= parseInt(maxYear) : true)
            );
        });
    };

    async function updateCar(updatedCar) {
        console.log(updatedCar);

        fetch(`${API_URL}/${updatedCar.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCar),
        })
            .then((response) => response.json())
            .then(() => {
                const index = cars.findIndex(car => car.id === updatedCar.id);
                if (index !== -1) {
                    cars[index] = {...updatedCar};
                    cars = [...cars];
                }
                editCarMode = false;
            })
            .catch((err) => console.error("Error updating car:", err));
    };

    const openEditCar = (car) => {
        carToEdit = car;
        editCarMode = true;
    };

    const handleCarAdded = () => {
        refreshList();
        addMoreCars = false;
    };

    const handleSearchInput = (event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = event.target.value;
        }, 300);
    };

    const handleClearFilters = () => {
        cars = allCars;
        selectedBrand = '';
        selectedModel = '';
        selectedYear = '';
        searchQuery = '';

        // Clear the search input field
        const searchInput = document.querySelector('input[type="text"][placeholder="Search cars..."]');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    const unsubscribe = userStore.subscribe(value => {
        user = {...value, isAdmin: value.isAdmin !== undefined ? value.isAdmin : false};
    });


    function startTimer() {
        setInterval(() => {
            cars = cars.map(car => ({
                ...car,
                remainingTime: getRemainingTime(car.time)
            }));
        }, 1000);
    }

    function getRemainingTime(endTime) {
        const now = new Date();
        const end = new Date(endTime);

        const nowTime = now.getTime();
        const endTimeStamp = end.getTime();

        const diff = endTimeStamp - nowTime;

        if (diff <= 0) {
            return 'Auction ended';
        }

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }


    onDestroy(() => {
        unsubscribe();
    });


</script>

<TailwindCss/>

<div class="bg-gradient-to-b from-[#2D2F33] to-[#252729] min-h-screen">
    <!-- Filter Bar - Horizontal at the top -->
    <div class="sticky top-0 z-10 bg-[#1E2023] border-b border-gray-700 shadow-lg">
        <div class="container mx-auto px-4 py-3">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <!-- Left side: Filters -->
                <div class="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-start">
                    <div>
                        <select
                                bind:value={selectedBrand}
                                class="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition min-w-[120px]"
                                on:change={() => handleFilterChange({ detail: { selectedBrand, selectedModel, minYear: selectedYear, maxYear: selectedYear } })}
                        >
                            <option value="">All Brands</option>
                            {#each brands as brand}
                                <option value={brand}>{brand}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <select
                                bind:value={selectedModel}
                                class="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition min-w-[120px]"
                                on:change={() => handleFilterChange({ detail: { selectedBrand, selectedModel, minYear: selectedYear, maxYear: selectedYear } })}
                        >
                            <option value="">All Models</option>
                            {#each models as model}
                                <option value={model}>{model}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <select
                                bind:value={selectedYear}
                                class="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition min-w-[120px]"
                                on:change={() => handleFilterChange({ detail: { selectedBrand, selectedModel, minYear: selectedYear, maxYear: selectedYear } })}
                        >
                            <option value="">All Years</option>
                            {#each years as year}
                                <option value={year}>{year}</option>
                            {/each}
                        </select>
                    </div>
                    <button
                            class="bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-3 py-2 text-sm transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            on:click={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                <div class="relative w-full md:w-1/3 mt-3 md:mt-0">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input
                            type="text"
                            placeholder="Search cars..."
                            on:input={handleSearchInput}
                            class="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 py-6">
        {#if user.isAdmin}
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-white">Car Auction Dashboard</h1>
                <button
                        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        on:click={() => (addMoreCars = true)}
                >
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Post New Car
            </span>
                </button>
            </div>

            {#if editCarMode}
                <div class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div class="bg-[#2C2C2E] p-6 rounded-lg max-w-lg w-full relative text-[#E0E0E0] shadow-2xl">
                        <button
                                class="absolute top-3 right-3 text-red-500 bg-[#2C2C2E] border border-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                on:click={() => (editCarMode = false)}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <EditCar selectedCar={carToEdit} {updateCar}/>
                    </div>
                </div>
            {/if}

            <!-- Add Car Modal -->
            {#if addMoreCars}
                <div class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div class="bg-[#2C2C2E] p-6 rounded-lg max-w-lg w-full relative text-[#E0E0E0] shadow-2xl">
                        <button
                                class="absolute top-3 right-3 text-red-500 bg-[#2C2C2E] border border-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                on:click={() => (addMoreCars = false)}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <!-- Add Car Form would go here -->
                    </div>
                </div>
            {/if}
        {:else}
            <!-- Regular User View -->
            <h1 class="text-2xl font-bold text-white mb-6">Available Cars</h1>
        {/if}

        <!-- Car Grid -->
        <div class="mt-6">
            {#if loading}
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
                </div>
            {:else if paginatedCars.length > 0}
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {#each paginatedCars as listedCars}
                        <div class="bg-[#2C2C2E] rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="relative">
                                <img
                                        class="h-48 w-full object-cover"
                                        src={listedCars.url}
                                        alt="{listedCars.brand} {listedCars.model}"
                                />
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <span class="inline-block bg-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                      {getRemainingTime(listedCars.time)}
                    </span>
                                </div>
                            </div>

                            <div class="p-4">
                                <h4 class="text-xl font-bold text-white mb-1">{listedCars.brand} {listedCars.model}</h4>
                                <div class="flex justify-between items-center mb-3">
                                    <p class="text-gray-400 text-sm">{listedCars.year}</p>
                                    <p class="text-green-400 font-semibold">{listedCars.price} kebabs</p>
                                </div>

                                <div class="flex flex-col space-y-2">
                                    <button
                                            class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 shadow-md"
                                            on:click={() => showCarDetails(listedCars)}
                                    >
                                        View Details
                                    </button>

                                    {#if user.isAdmin}
                                        <div class="flex space-x-2">
                                            <button
                                                    class="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 text-sm"
                                                    on:click={() => openEditCar(listedCars)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                    class="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 text-sm"
                                                    on:click={() => deleteCar(listedCars.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else if searchQuery.length > 0}
                <div class="flex flex-col items-center justify-center h-64 text-center">
                    <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-gray-400 text-xl font-medium">No results for "{searchQuery}"</p>
                    <button
                            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                            on:click={handleClearFilters}
                    >
                        Clear Search
                    </button>
                </div>
            {:else}
                <div class="flex flex-col items-center justify-center h-64 text-center">
                    <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <p class="text-gray-400 text-xl font-medium">The auction is empty</p>
                    {#if user.isAdmin}
                        <button
                                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                on:click={() => (addMoreCars = true)}
                        >
                            Add Your First Car
                        </button>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Pagination -->
        {#if filteredCars.length > pageSize}
            <div class="mt-8 flex justify-center">
                <div class="inline-flex rounded-md shadow-sm">
                    <button
                            on:click={() => page = Math.max(1, page - 1)}
                            class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l-lg hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span class="px-4 py-2 text-sm font-medium text-white bg-gray-700">
              Page {page} of {Math.ceil(filteredCars.length / pageSize)}
            </span>
                    <button
                            on:click={() => page += 1}
                            class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-r-lg hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={page * pageSize >= filteredCars.length}
                    >
                        Next
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>