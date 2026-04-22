import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true" && repository;

export default defineConfig({
  base: isGitHubPagesBuild ? `/${repository}/` : "/",
  plugins: [vue()],
});
