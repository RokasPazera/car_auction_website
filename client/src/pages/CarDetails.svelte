<script>
    import {userStore} from '../stores/userStores';
    import {onDestroy} from 'svelte';
    import Page from 'page';

    export let currentParams;
    let car = {};
    let bids = {};
    let loading = true;
    let error = null;
    let bidsLoading = true;
    let bidsError = null;
    let winningBidAmount = 0;
    let newBidAmount = 0;
    let bidderName = '';
    let time;
    let isAuctionActive = false;
    let timeRemaining = '';
    let showBidHistory = false;

    let id;
    if (currentParams) {
        ({id} = currentParams);
    }
    let user = {id: null, username: '', email: '', isAdmin: false};

    const fetchWinningBid = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cars/${id}/winning-bid`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const {winningBid} = await response.json();
            winningBidAmount = winningBid.amount;
        } catch (err) {
            console.error("Error fetching winning bid:", err);
            bidsError = "Failed to load winning bid.";
        }
    };

    const fetchBids = async () => {
        await fetchWinningBid();
        try {
            const bidsResponse = await fetch(`http://localhost:3000/cars/${id}/bids`, {
                method: 'GET',
            });
            if (!bidsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const bidsData = await bidsResponse.json();
            bidsData.bids.forEach(bid => {
                if (!bids[bid.amount]) {
                    bids[bid.amount] = [];
                }
                bids[bid.amount].push(bid);
            });
            bidsLoading = false;
        } catch (err) {
            console.error("Error fetching bids", err);
            bidsError = "Failed to load";
            bidsLoading = false;
        }
    };

    const postNewBid = async () => {
        if (!isAuctionActive) {
            alert('Auction has ended. You cannot place a new bid.');
            return;
        }
        if (newBidAmount <= winningBidAmount) {
            alert("Bid must be higher than the current winning bid.");
            return;
        }

        const newBid = {
            carId: id,
            amount: newBidAmount,
            bidder: user.username,
            date: new Date().toISOString(),
        };

        try {
            const bidsResponse = await fetch(`http://localhost:3000/cars/${id}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBid),
            });
            if (!bidsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const bidsData = await bidsResponse.json();
            if (!bids[newBid.amount]) {
                bids[newBid.amount] = [];
            }
            bids[newBid.amount].push(newBid);

            newBidAmount = 0;
        } catch (err) {
            console.error("Error posting new bid:", err);
            bidsError = "Failed to post new bid.";
        }
    };

    const fetchCarDetails = async () => {
        try {
            const carResponse = await fetch(`http://localhost:3000/cars/${id}`);
            if (!carResponse.ok) {
                throw new Error('Network response was not ok');
            }
            car = await carResponse.json();
            if (car.time) {
                updateTimeRemaining();
                setInterval(updateTimeRemaining, 1000);
            }
            loading = false;
        } catch (err) {
            console.error("Error fetching car details:", err);
            error = "Failed to load car details.";
            loading = false;
        }
    };

    const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const auctiontime = new Date(car.time).getTime();

        const diff = auctiontime - now;

        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            timeRemaining = `${hours}h ${minutes}m ${seconds}s`;
            isAuctionActive = true;
        } else {
            time = 'Auction ended';
            isAuctionActive = false;
        }
    };

    const toggleBidHistory = () => {
        showBidHistory = !showBidHistory;
    };

    fetchBids();
    fetchCarDetails();

    const unsubscribe = userStore.subscribe(value => {
        user = {...value};
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="bg-neutral-900 min-h-screen">
    <!-- Header with navigation back -->
    <div class="container mx-auto px-4 py-6">
        <button on:click={() => Page('/')}
                class="inline-flex items-center text-neutral-400 hover:text-neutral-300 transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clip-rule="evenodd"/>
            </svg>
            Back to Listings
        </button>

        {#if loading}
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
            </div>
        {:else if error}
            <div class="bg-red-500 text-white p-4 rounded-lg shadow-md">
                <p>{error}</p>
            </div>
        {:else if Object.keys(car).length > 0}
            <div class="bg-neutral-900 rounded-xl shadow-2xl overflow-hidden">
                <!-- Car details section -->
                <div class="md:flex h-96">
                    <!-- Car image section -->
                    <div class="md:w-1/2 relative h-full">
                        <img
                                src={car.url}
                                alt="{car.brand} {car.model}"
                                class="w-full h-full object-cover"
                        />
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900 to-transparent p-4">
                            <h1 class="text-3xl font-bold text-white">{car.brand} {car.model}</h1>
                            <p class="text-neutral-300 text-lg">{car.year}</p>
                        </div>
                    </div>

                    <!-- Car info section -->
                    <div class="md:w-1/2 p-6 bg-neutral-800">
                        <div class="mb-6">
                            <h2 class="text-xl font-semibold text-neutral-200 mb-2">Description</h2>
                            <p class="text-neutral-400">{car.description}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-neutral-700 p-4 rounded-lg">
                                <p class="text-neutral-400 text-sm">Starting Price</p>
                                <p class="text-white text-xl font-bold">{car.price} kebabs</p>
                            </div>
                            <div class="bg-neutral-700 p-4 rounded-lg">
                                <p class="text-neutral-400 text-sm">Current Bid</p>
                                <p class="text-white text-xl font-bold">{winningBidAmount || 'No bids'} {winningBidAmount ? 'kebabs' : ''}</p>
                            </div>
                        </div>

                        <!-- Auction status -->
                        <div class="mb-6">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xl font-semibold text-neutral-200">Auction Status</h2>
                                <div class={`px-3 py-1 rounded-full text-sm font-medium ${isAuctionActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{isAuctionActive ? 'Active' : 'Ended'}</div>
                            </div>
                            {#if isAuctionActive}
                                <div class="mt-2 bg-neutral-700 p-4 rounded-lg">
                                    <p class="text-neutral-400 text-sm">Time Remaining</p>
                                    <p class="text-white text-xl font-bold">{timeRemaining}</p>
                                    <div class="w-full bg-neutral-600 rounded-full h-2.5 mt-2">
                                        <div class="bg-neutral-400 h-2.5 rounded-full" style="width: 45%"></div>
                                    </div>
                                </div>
                            {:else}
                                <p class="mt-2 text-red-400">This auction has ended</p>
                            {/if}
                        </div>

                        <!-- Bidding section -->
                        {#if user.username !== ''}
                            <div class="mb-6">
                                <h2 class="text-xl font-semibold text-neutral-200 mb-2">Place Your Bid</h2>
                                {#if isAuctionActive}
                                    <div class="flex space-x-2">
                                        <input
                                                type="number"
                                                bind:value={newBidAmount}
                                                placeholder="Enter bid amount"
                                                class="flex-1 bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                        />
                                        <button
                                                on:click={postNewBid}
                                                class="bg-neutral-700 hover:bg-neutral-800 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Place Bid
                                        </button>
                                    </div>
                                    <p class="text-sm text-neutral-400 mt-2">Minimum bid: {winningBidAmount + 1}
                                        kebabs</p>
                                {:else}
                                    <p class="text-red-400">Bidding is closed for this auction</p>
                                {/if}
                            </div>
                        {:else}
                            <div class="mb-6 bg-neutral-700 p-4 rounded-lg">
                                <p class="text-neutral-300">Please log in to place a bid</p>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Bid history section -->
                <div class="p-6 border-t border-neutral-700">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-neutral-200">Bid History</h2>
                        <button
                                on:click={toggleBidHistory}
                                class="text-neutral-400 hover:text-neutral-300 text-sm flex items-center"
                        >
                            {showBidHistory ? 'Hide' : 'Show'} History
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fill-rule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>

                    {#if showBidHistory}
                        {#if bidsLoading}
                            <div class="flex justify-center items-center h-20">
                                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-neutral-400"></div>
                            </div>
                        {:else if bidsError}
                            <div class="bg-red-500/20 text-red-400 p-4 rounded-lg">
                                <p>{bidsError}</p>
                            </div>
                        {:else if Object.keys(bids).length > 0}
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-neutral-700">
                                    <thead>
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                            Bidder
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="divide-y divide-neutral-700 bg-neutral-800">
                                    {#each Object.keys(bids).sort((a, b) => b - a) as amount}
                                        {#each bids[amount] as bid}
                                            <tr class="hover:bg-neutral-700">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{amount}
                                                    kebabs
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{bid.bidder}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{new Date(bid.date).toLocaleString()}</td>
                                            </tr>
                                        {/each}
                                    {/each}
                                    </tbody>
                                </table>
                            </div>
                        {:else}
                            <p class="text-neutral-400 text-center py-4">No bids have been placed yet.</p>
                        {/if}
                    {/if}
                </div>
            </div>
        {:else}
            <div class="bg-yellow-500/20 text-yellow-400 p-4 rounded-lg shadow-md">
                <p>No car details found.</p>
            </div>
        {/if}
    </div>
</div>