<script setup lang="ts">
import {onMounted} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()

onMounted(() => {
  //   router.routerLoaded()
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md">
      <h1 class="mb-8 text-center text-3xl font-bold">Welcome</h1>

      <div class="rounded-lg bg-white p-8 shadow-lg">
        <form class="flex flex-col gap-4">
          <div>
            <label class="mb-1 block text-sm font-medium" for="email">Email</label>
            <input id="email" type="email" class="w-full rounded border p-2" placeholder="Enter your email" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium" for="password">Password</label>
            <input id="password" type="password" class="w-full rounded border p-2" placeholder="Enter your password" />
          </div>

          <button type="submit" class="mt-2 rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600">Sign In</button>
        </form>
      </div>
    </div>
  </div>
</template>
