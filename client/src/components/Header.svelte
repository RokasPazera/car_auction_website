<script>
    import { userStore } from '../stores/userStores.js';
    import { tokenStore } from '../stores/authStore.js';
    import Page from 'page';
    import { onMount } from 'svelte';

    let user;
    let token;
    let mobileMenuOpen = false;

    userStore.subscribe(value => {
        user = value;
    });

    tokenStore.subscribe(value => {
        token = value;
    })

    const handleLogout = () => {
        userStore.set({
            id: null,
            username: '',
            email: '',
            isAdmin: false,
        });
        tokenStore.set(null);
        Page('/');
    }

    const navigateToLogin = () => {
        Page('/auth/user');
    };

    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    };

    // Close mobile menu when navigating
    const handleNavigation = (path) => {
        Page(path);
        mobileMenuOpen = false;
    };
</script>

<header class="bg-[#1C1E21] text-white shadow-md">
    <!-- Main Navigation Bar -->
    <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
            <!-- Logo Section -->
            <div class="flex items-center">
                <a on:click={() => Page('/')} class="flex items-center cursor-pointer">
                    <img src="/one-yaris-toyota.gif" alt="Logo" class="h-12 max-h-full mr-3">
                    <span class="text-lg font-bold">Best car auction site!</span>
                </a>
            </div>

            <!-- Admin Link (Only visible to admins) -->
            <nav class="hidden md:flex items-center">
                {#if user.id !== null && user.isAdmin}
                    <a href="#" class="text-gray-300 hover:text-white transition duration-300">Admin</a>
                {/if}
            </nav>

            <!-- Auth Buttons -->
            <div class="flex items-center space-x-4">
                {#if user.id !== null}
                    <span class="hidden md:inline text-sm text-gray-400">Welcome, {user.username}</span>
                    <button
                            on:click={handleLogout}
                            class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Logout
                    </button>
                {:else}
                    <button
                            on:click={navigateToLogin}
                            class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Log In
                    </button>
                {/if}

                <!-- Mobile Menu Button -->
                <button on:click={toggleMobileMenu} class="md:hidden text-gray-300 hover:text-white focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation Menu (Toggled by mobileMenuOpen state) -->
    <div class="md:hidden bg-[#252729] border-t border-gray-700 transition-all duration-300 ease-in-out overflow-hidden"
         style="max-height: {mobileMenuOpen ? '300px' : '0px'}">
        <div class="container mx-auto px-4 py-3">
            <div class="flex flex-col space-y-3">
                {#if user.id !== null && user.isAdmin}
                    <a href="#" class="text-gray-300 hover:text-white py-2 transition duration-300">Admin</a>
                {/if}
            </div>
        </div>
    </div>
</header>