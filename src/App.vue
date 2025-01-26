<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="logo">VodFlix</router-link>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">ホーム</router-link>
        <router-link to="/movies" class="nav-item" :class="{ active: route.path === '/movies' }">映画</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style>
@import '@mdi/font/css/materialdesignicons.css';

:root {
  --primary-color: #e50914;
  --background-color: #141414;
  --text-color: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.app {
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
}

.navbar-brand .logo {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.nav-item {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-item:hover,
.nav-item.active {
  color: var(--primary-color);
}
</style>
