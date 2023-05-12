<template>
  <div>
    <h1>Chat Rooms</h1>
    <ul>
      <li v-for="room in rooms" :key="room.name">
        <router-link :to="{ name: 'Room', params: { id:
      room.name } }">{{ room.name }}</router-link>
  </li>
</ul>
<form @submit.prevent="createRoom">
  <label for="name">New Room:</label>
  <input type="text" id="name" v-model="newRoomName" required />
  <button>Create</button>
</form>
</div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      rooms: [],
      newRoomName: '',
    };
  },
  mounted() {
    this.$socket.emit('get-rooms');
    this.$socket.on('rooms-data', (data) => {
      this.rooms = data;
    });
  },
  methods: {
    createRoom() {
      this.$socket.emit('create-room', this.newRoomName);
      this.newRoomName = '';
    },
  },
};
</script>
