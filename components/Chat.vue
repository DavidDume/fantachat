<template>
    <div class="flex justify-center items-center flex-col mt-4 mb-8">
        <div class="md:w-[70%] w-full h-[600px] border">
            <div class="h-full overflow-y-scroll flex flex-col">
                <div  v-for="(message, index) in messages" :key="index">
                    <div class=" py-5 px-1 w-auto flex items-center" :class="message.role == 'user' ? '' : 'bg-[#D9EDDF]'">
                        <div class="">
                            <Icon :name="message.role == 'user' ? 'mdi:account' : 'mdi:rocket-launch'" class="w-20" />
                        </div>
                        
                        <h4 class="leading-6">
                            {{ message.content }}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-[50px] md:w-[70%] w-full bg-[#edede9] flex justify-center p-2">
            <input type="text" v-model="userInput"  @keyup.enter="sendMessage" class="border w-[60%] outline-none p-2" placeholder="Chiedi consigli....">
            <button class="flex items-center h-[100%] p-1.5 px-2 bg-[#78c6a3]" @click="sendMessage">
                <Icon name="ic:round-send" size="20" color="#ffffff"/>
            </button>
        </div>
       
    </div>

</template>

<script setup>

    import axios from 'axios'
    
    let messages = ref([])
    let userInput = ref('');

    const sendMessage = async () => { 
        const userMessage = {role: 'user', content: userInput.value}
        userInput.value = ''
        messages.value.push(userMessage)

        const response = await axios.post("/api/getMessage", {
            messages
        });

        messages.value.push({role: 'system', content: response.data})

        //console.log(response.data.value);
    } 

   /*  const source = new EventSource()
    source.onmessage = ev => {
        console.log('message received');
    } */

</script>

