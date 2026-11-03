<script setup>defineProps({ compact: Boolean })</script>
<template>
  <RouterLink to="/" class="brand" aria-label="Информационный мир — главная">
    <span class="brand-symbol"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M5 27V9l13 8L31 9v18l-13-8Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round" /></svg></span>
    <span v-if="!compact" class="brand-type">ИНФОРМАЦИОННЫЙ<span>МИР<span class="brand-dot">.</span></span></span>
  </RouterLink>
</template>
