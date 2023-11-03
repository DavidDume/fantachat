<template>
    
    <Hero />
    <div class="w-[70%] mx-auto p-2 flex items-center" id="chat">
        <p class="leading-7">
            Esempi di domande:<br>
            Chi dovrei schierare tra Immobile e Lukaku questa settimana?<br>
            Pensi che sia il momento giusto per vendere Chiesa?<br>
            Come dovrei gestire il mio budget per equilibrare la mia squadra?
        </p>
    </div>
    <Chat />
    <FAQ />

</template>

<script setup>
    import Hero from '~/components/Hero.vue'
    import Chat from '~/components/Chat.vue';
    import FAQ from '~/components/FAQ.vue';

</script>

