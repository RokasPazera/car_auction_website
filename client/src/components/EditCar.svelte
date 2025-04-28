<script>
    
    export let selectedCar;
    export let updateCar;
    let car = selectedCar;

    let updatedCar = { ...car };
  
    const handleSubmit = () => {
        updateCar(updatedCar);
    };
</script>

<div class="p-6 rounded-lg bg-[#2C2C2E] text-[#E0E0E0]">
    <h2 class="text-2xl font-bold mb-4">Edit Car</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
            <label>Brand:</label>
            <input type="text" bind:value={updatedCar.brand} class="bg-gray-200 text-black p-2 w-full" required />
        </div>
        <div class="mb-4">
            <label>Model:</label>
            <input type="text" bind:value={updatedCar.model} class="bg-gray-200 text-black p-2 w-full" required />
        </div>
        <div class="mb-4">
            <label>Year:</label>
            <input type="number" bind:value={updatedCar.year} class="bg-gray-200 text-black p-2 w-full" required />
        </div>
        <div class="mb-4">
            <label>Price:</label>
            <input type="number" bind:value={updatedCar.price} class="bg-gray-200 text-black p-2 w-full" required />
        </div>
        <div class="mb-4">
            <label>Time:</label>
            <input type="datetime-local" bind:value={updatedCar.time} class="bg-gray-200 text-black p-2 w-full" required />
        </div>
        <div class="mb-4">
            <label>Description:</label>
            <textarea bind:value={updatedCar.description} class="bg-gray-200 text-black p-2 w-full" required></textarea>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update Car</button>
    </form>
</div>
