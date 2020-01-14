<template>
    <div>
        <app-header></app-header>
        <app-navbar></app-navbar>
        <app-main></app-main>
    </div>
</template>
<script>
import appHeader from './appheader'
import appNavbar from './appnavbar'
import appMain from './appmain'

export default {
    components: {
        appHeader,
        appNavbar,
        appMain
    }
}
</script>
<style scoped>
    .header{
        position: absolute;
        line-height: 50px;
        top: 0px;
        left: 0px;
        right: 0px;
        background: #2b3c4d;
    }
    .navbar{
        position: absolute;
        width: 230px;
        top: 50px;
        left: 0px;
        bottom: 0px;
        background: #545c64;
    }
    .main{
        position: absolute;
        top: 50px;
        left: 230px;
        right: 0px;
        bottom: 0px;
        padding: 10px;
    }
</style>