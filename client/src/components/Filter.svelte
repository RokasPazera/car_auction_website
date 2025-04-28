<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let brands = [];
  export let models = [];
  export let minYearOptions = [];
  export let maxYearOptions = [];

  export let selectedBrand = '';
  export let selectedModel = '';

  let tempBrand = selectedBrand;
  let tempModel = selectedModel;
  let tempMinYear = '';
  let tempMaxYear = '';

  
  let errorMessage ='';

  const handleApplyFilter = () => {

    errorMessage = '';

    if (tempMinYear && tempMaxYear && parseInt(tempMinYear) > parseInt(tempMaxYear)) {
      errorMessage = 'Minimum year cannot be greater than maximum year.';
      return;
    }

    dispatch('filter', {
      selectedBrand: tempBrand,
      selectedModel: tempModel,
      minYear: tempMinYear,
      maxYear: tempMaxYear,
    });
  };

  const clearFilters = () => {
    tempBrand = '';
    tempModel = '';
    tempMinYear = '';
    tempMaxYear = '';
    errorMessage = '';
    dispatch('clearFilters')
  }
</script>

<div class="flex flex-col space-y-4 my-4 p-4 bg-[#1C1C1E] text-white rounded-lg">
  <select bind:value={tempBrand} class="custom-select px-4 py-2 border rounded-lg bg-gray-700 text-white">
    <option value="">All Brands</option>
    {#each brands as brand}
      <option value={brand}>{brand}</option>
    {/each}
  </select>

  <select bind:value={tempModel} class="custom-select px-4 py-2 border rounded-lg bg-gray-700 text-white">
    <option value="">All Makes</option>
    {#each models as model}
      <option value={model}>{model}</option>
    {/each}
  </select>

  <select bind:value={tempMinYear} class="custom-select px-4 py-2 border rounded-lg bg-gray-700 text-white">
    <option value="">Min Year</option>
    {#each minYearOptions as year}
      <option value={year}>{year}</option>
    {/each}
  </select>

  <select bind:value={tempMaxYear} class="custom-select px-4 py-2 border rounded-lg bg-gray-700 text-white">
    <option value="">Max Year</option>
    {#each maxYearOptions as year}
      <option value={year}>{year}</option>
    {/each}
  </select>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <button
    on:click={handleApplyFilter}
    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    Apply Filter
  </button>

  <button
      on:click={clearFilters}
      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Clear Filters
    </button>
</div>


<style>
  .custom-select {
    appearance: none;
    background-image: none;
    padding-right: 2rem;        
  }

  .custom-select:focus {
    outline: none;
  }
</style>