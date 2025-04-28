<script>
  import Footer from './components/Footer.svelte';
  import Header from './components/Header.svelte';
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Cars from './pages/Cars.svelte'
  import CarDetails from "./pages/CarDetails.svelte";
  import Login from './pages/Login.svelte';
 
  import Page from 'page';

  let currentRoute;
  let currentParams;

  
  Page('/', (ctx) => { 
    currentRoute = Cars; 
    currentParams = ctx.params;
  });
  
  Page('/cars/:id', (ctx) => {
    currentRoute = CarDetails;
    currentParams = ctx.params;
  });

  Page('/auth/user', (ctx) => { 
    currentRoute = Login; 
    currentParams = ctx.params; 
  });
  
  Page('*', (ctx) => { 
    currentRoute = undefined; 
    currentParams = ctx.params;
    console.error('Route not found');
  });

  
  Page.start();
</script>

<TailwindCss />

<Header />

<svelte:component this={currentRoute} {currentParams}/>

<Footer />
