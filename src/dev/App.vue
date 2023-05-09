<template>
  <div class="nav">
    <template v-for="route of routes" :key="route[0]">
      <RouterLink :to="{ name: route[0] }">
        {{ route[1] }}
      </RouterLink>
    </template>
  </div>
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
const routes = [
  ["basic", "Basic"],
  ["checklist", "Checklist"],
  ["core", "Core"],
  ["full", "Full"]
];
</script>

<style lang="scss">
@import "@/dev/style";

.nav {
  display: flex;
  justify-content: space-around;
  font-size: 24px;
}
</style>
