<template>
    <div class="main">
        <top-link v-show="$route.path !== '/home/'"></top-link>
        <router-view></router-view>
    </div>
</template>
<script>
import topLink from '@/components/top-link.vue'
export default {
    components: {
        topLink
    }
}
</script>