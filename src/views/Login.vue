<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
        <button>Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data() {
      return {
        username: '',
      };
    },
    methods: {
      login() {
        localStorage.setItem('username', this.username);
        this.$router.push('/');
      },
    },
  };
  </script>