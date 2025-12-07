// import { createRouter, createWebHistory } from "vue-router";
// import { useAuthStore } from "../stores/authStore";

// // Views
// import Login from "../views/Login.vue";
// import Register from "../views/Register.vue";
// import Home from "../views/Home.vue";
// import CreateCharacter from "../views/CreateCharacter.vue";
// import Game from "../views/Game.vue"; // Main World View
// import Inventory from "../views/Inventory.vue";
// import Marketplace from "../views/Marketplace.vue";
// import Leaderboard from "../views/Leaderboard.vue";
// import Admin from "../views/Admin.vue";
// import Battle from "../views/Battle.vue";
// import Profile from "../views/Profile.vue";
// import Notifications from "../views/Notifications.vue";
// import Friends from "../views/Friends.vue";
// import ForgotPassword from "../views/ForgotPassword.vue";
// import Village from "../views/Village.vue"; // <--- Import lại Village (Base)
// import Explore from "../views/Explore.vue"; // <--- Import Explore (Map)
// import Character from "../views/Character.vue";

// const routes = [
//   { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
//   { path: "/login", name: "Login", component: Login },
//   { path: "/register", name: "Register", component: Register },
//   {
//     path: "/create-character",
//     name: "CreateCharacter",
//     component: CreateCharacter,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/village", // <--- Route Căn Cứ Địa (Safe Zone)
//     name: "Village",
//     component: Village,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/game", // <--- Có thể dùng làm Main Layout hoặc Hub tổng
//     name: "Game",
//     component: Game,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/explore", // <--- Route Chọn Map Chiến Đấu
//     name: "Explore",
//     component: Explore,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/character",
//     name: "Character",
//     component: Character,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/inventory",
//     name: "Inventory",
//     component: Inventory,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/market",
//     name: "Marketplace",
//     component: Marketplace,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/leaderboard",
//     name: "Leaderboard",
//     component: Leaderboard,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/admin",
//     name: "Admin",
//     component: Admin,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/battle",
//     name: "Battle",
//     component: Battle,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/profile",
//     name: "Profile",
//     component: Profile,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/notifications",
//     name: "Notifications",
//     component: Notifications,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/friends",
//     name: "Friends",
//     component: Friends,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/forgot-password",
//     name: "ForgotPassword",
//     component: ForgotPassword,
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   // Check auth cơ bản
//   if (to.meta.requiresAuth && !authStore.token) {
//     next("/login");
//   } else {
//     next();
//   }
// });

// export default router;

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import CreateCharacter from "../views/CreateCharacter.vue";
import Inventory from "../views/Inventory.vue";
import Marketplace from "../views/Marketplace.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Admin from "../views/Admin.vue";
import Battle from "../views/Battle.vue";
import Profile from "../views/Profile.vue";
import Notifications from "../views/Notifications.vue";
import Friends from "../views/Friends.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Village from "../views/Village.vue";
import Explore from "../views/Explore.vue";
import Character from "../views/Character.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/create-character", name: "CreateCharacter", component: CreateCharacter, meta: { requiresAuth: true } },
  { path: "/village", name: "Village", component: Village, meta: { requiresAuth: true } },
  { path: "/explore", name: "Explore", component: Explore, meta: { requiresAuth: true } },
  { path: "/inventory", name: "Inventory", component: Inventory, meta: { requiresAuth: true } },
  { path: "/market", name: "Marketplace", component: Marketplace, meta: { requiresAuth: true } },
  { path: "/leaderboard", name: "Leaderboard", component: Leaderboard, meta: { requiresAuth: true } },
  { path: "/admin", name: "Admin", component: Admin, meta: { requiresAuth: true } },
  { path: "/battle", name: "Battle", component: Battle, meta: { requiresAuth: true } },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/notifications", name: "Notifications", component: Notifications, meta: { requiresAuth: true } },
  { path: "/friends", name: "Friends", component: Friends, meta: { requiresAuth: true } },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword },
  { path: "/character", name: "Character", component: Character, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) next("/login");
  else next();
});

export default router;