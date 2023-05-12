import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("message", (message) => {
  console.log(message);
});

const app = createApp(App);
app.config.globalProperties.$socket = socket;
app.use(router);
app.mount("#app");
