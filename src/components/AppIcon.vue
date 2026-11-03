<script setup>
import { ArrowUpRight, ArrowRight, ArrowLeft, BookOpen, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Clock3, Cpu, Expand, Eye, Heart, Info, Library, List, LockKeyhole, Maximize2, Menu, Moon, QrCode, RotateCcw, Search, ShieldCheck, Sparkles, Sun, Users, X } from '@lucide/vue'
defineProps({ name: String, size: { type: [Number, String], default: 20 } })
const icons = { arrowUpRight: ArrowUpRight, arrowRight: ArrowRight, arrowLeft: ArrowLeft, book: BookOpen, bookmark: Bookmark, check: Check, down: ChevronDown, left: ChevronLeft, right: ChevronRight, sort: ChevronsUpDown, clock: Clock3, cpu: Cpu, expand: Expand, eye: Eye, heart: Heart, info: Info, library: Library, list: List, lock: LockKeyhole, maximize: Maximize2, menu: Menu, moon: Moon, qr: QrCode, reset: RotateCcw, search: Search, shield: ShieldCheck, sparkles: Sparkles, sun: Sun, users: Users, close: X }
</script>

<template><component :is="icons[name] || BookOpen" :size="size" :stroke-width="1.65" aria-hidden="true" /></template>
