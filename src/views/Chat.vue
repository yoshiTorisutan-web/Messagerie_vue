<template>
    <div>
      <h1>{{ roomName }}</h1>
      <ul>
        <li v-for="message in messages" :key="message.id">
          <span>{{ message.username }}:</span>
          <span>{{ message.text }}</span>
        </li>
      </ul>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="message" required />
        <button>Send</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Room',
    props: ['id'],
    data() {
      return {
        roomName: '',
        messages: [],
        message: '',
      };
    },
    mounted() {
      this.$socket.emit('join-room', { room: this.id });
      this.$socket.on('room-data', (data) => {
        this.roomName = data.room;
        this.users = data.users;
      });
      this.$socket.on('message', (message) => {
        this.messages.push(message);
      });
    },
    methods: {
      sendMessage() {
        this.$socket.emit('message', this.message);
        this.message = '';
      },
    },
  };
  </script>
  