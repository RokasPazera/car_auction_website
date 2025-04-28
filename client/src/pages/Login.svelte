<script>
    import { createEventDispatcher } from 'svelte';
    import Page from 'page';
    import { userStore} from '../stores/userStores.js';
    import { tokenStore } from '../stores/authStore.js';

    let username = '';
    let email = '';
    let password = '';
    let repeatPassword = '';
    let errorMessage = '';
    let dispatch = createEventDispatcher();
    let login = true;
    let register = false;



    const handleSubmit = async (event) => {
        event.preventDefault();
        errorMessage = '';

        try {
            const response = await fetch('http://localhost:3000/auth/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg);
            }
            console.log(data);

            tokenStore.set(data.token);

            userStore.set({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                isAdmin: data.user.isAdmin,
            });


            dispatch('user', { user: data });
            Page('/');
        } catch (error) {
            errorMessage = error.message || JSON.stringify(error);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        errorMessage = '';

        if (password !== repeatPassword) {
            errorMessage = 'Passwords do not match';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/newUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            dispatch('newUser', { user: data.user });
            Page('/');
        } catch (error) {
            errorMessage = error.message;
        }
    };

    const toggleLogin = () => {
        register = false;
        login = true;
    };

    const toggleRegister = () => {
        register = true;
        login = false;
    };
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] p-4">
    <div class="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div class="w-full flex justify-center mb-6">

        </div>
        {#if login}
            <h2 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Sign in to your account</h2>
            <p class="text-gray-400 mb-6 text-sm">Welcome back! Please enter your details.</p>
            <form class="space-y-5 w-full" on:submit={handleSubmit} autocomplete="on">
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Email</span>
                    <input type="email" placeholder="Email" bind:value={email} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="email" />
                </label>
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Password</span>
                    <input type="password" placeholder="Password" bind:value={password} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="current-password" />
                </label>
                <button type="submit" class="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Log In</button>
            </form>
            {#if errorMessage}
                <p class="text-red-500 mt-4 text-center font-medium">{errorMessage}</p>
            {/if}
            <div class="mt-6 text-center">
                <span class="text-gray-400">Don't have an account?</span>
                <button on:click={toggleRegister} class="ml-2 text-gray-400 hover:text-gray-300 font-semibold underline transition">Register</button>
            </div>
        {/if}
        {#if register}
            <h2 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Create your account</h2>
            <p class="text-gray-400 mb-6 text-sm">Join us and start bidding!</p>
            <form class="space-y-5 w-full" on:submit={handleRegisterSubmit} autocomplete="on">
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Username</span>
                    <input type="text" placeholder="Username" bind:value={username} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="username" />
                </label>
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Email</span>
                    <input type="email" placeholder="Email" bind:value={email} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="email" />
                </label>
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Password</span>
                    <input type="password" placeholder="Password" bind:value={password} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="new-password" />
                </label>
                <label class="block text-left">
                    <span class="text-gray-300 text-sm font-medium">Repeat Password</span>
                    <input type="password" placeholder="Repeat password" bind:value={repeatPassword} class="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition" required autocomplete="new-password" />
                </label>
                <button type="submit" class="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Register</button>
            </form>
            {#if errorMessage}
                <p class="text-red-500 mt-4 text-center font-medium">{errorMessage}</p>
            {/if}
            <div class="mt-6 text-center">
                <span class="text-gray-400">Already have an account?</span>
                <button on:click={toggleLogin} class="ml-2 text-gray-400 hover:text-gray-300 font-semibold underline transition">Login</button>
            </div>
        {/if}
    </div>
</main>