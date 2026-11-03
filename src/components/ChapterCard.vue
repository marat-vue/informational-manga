<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { pagePath, readerPath } from '../data/chapters'
import { useReaderStore } from '../stores/reader'
const props = defineProps({ chapter: Object, index: { type: Number, default: 0 } })
const store = useReaderStore()
const progress = computed(() => store.progress[props.chapter.id] || 0)
const complete = computed(() => progress.value === props.chapter.pages)
</script>

<template>
  <RouterLink :to="readerPath(chapter.id, progress || 1)" class="chapter-card group" :style="{ '--chapter-color': chapter.color, '--chapter-background': chapter.background, '--card-delay': `${index * 65}ms` }">
    <div class="chapter-cover" :class="`cover-${chapter.id}`">
      <img :src="pagePath(chapter.id)" :alt="`Обложка главы «${chapter.title}»`" loading="lazy" width="905" height="1280" />
      <span class="cover-shade"></span>
      <span class="chapter-number">ГЛАВА <b>0{{ chapter.id }}</b></span>
      <span class="cover-top-icon"><AppIcon :name="chapter.icon" :size="16" /></span>
      <span class="cover-bottom"><span>{{ chapter.topic }}</span><span class="cover-read"><AppIcon :name="complete ? 'check' : 'arrowUpRight'" :size="22" /></span></span>
      <span v-if="progress" class="card-progress" :style="{ width: `${progress / chapter.pages * 100}%` }"></span>
    </div>
    <div class="chapter-card-meta"><span>{{ chapter.pages }} страниц</span><span v-if="complete" class="text-accent">Прочитано <AppIcon name="check" :size="13" /></span><span v-else-if="progress" class="text-accent">Читаю · {{ progress }}/{{ chapter.pages }}</span><span v-else>~ {{ Math.ceil(chapter.pages * .6) }} мин</span></div>
    <h3>{{ chapter.title }}</h3>
    <p>{{ chapter.description }}</p>
  </RouterLink>
</template>
