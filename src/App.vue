<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" class="navbar-brand">Fruits</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <a href="/nutritions" class="nav-link">nutritions</a>
        </li>        
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>
