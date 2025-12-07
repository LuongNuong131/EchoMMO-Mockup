<template>
  <div class="max-w-md mx-auto">
    <LoadingSpinner v-if="loading" />

    <div
      v-if="error"
      class="bg-danger/20 border border-danger/50 text-red-200 p-4 rounded-lg"
    >
      {{ error }}
    </div>

    <transition name="fade">
      <div
        v-if="!loading && data"
        class="bg-bg-card shadow-xl rounded-lg overflow-hidden"
      >
        <div class="p-6 text-center border-b border-gray-700">
          <div class="text-6xl mb-2">{{ data.resourceIcon }}</div>
          <h1 class="text-3xl font-bold">{{ data.resourceName }}</h1>
          <p class="text-text-dim">{{ data.requirementText }}</p>
        </div>

        <div class="p-6">
          <div class="flex justify-between mb-2">
            <span>Cấp độ kỹ năng</span>
            <span class="font-bold text-primary">{{ data.gatherLevel }}</span>
          </div>

          <div>
            <div class="flex justify-between text-sm text-text-dim mb-1">
              <span>Kinh nghiệm</span>
              <span>
                {{ data.expPercent.toFixed(1) }}% (Đến cấp
                {{ data.gatherLevel + 1 }})
              </span>
            </div>

            <div class="w-full bg-gray-700 rounded-full h-4">
              <div
                class="bg-primary h-4 rounded-full transition-all duration-300"
                :style="{ width: data.expPercent + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-4 p-4 bg-gray-700 rounded-lg text-center">
            Chi phí:
            <span class="font-bold text-warning">
              {{ data.energyCost }} Năng lượng
            </span>
          </div>
        </div>

        <div
          class="p-4 h-16 bg-gray-900/50 text-center text-text-muted text-lg"
        >
          <transition name="fade" mode="out-in">
            <span :key="log">{{ log }}</span>
          </transition>
        </div>

        <div class="p-4 bg-gray-700 grid grid-cols-2 gap-4">
          <button
            @click="doGather"
            :disabled="isGathering"
            class="btn-action btn-success"
          >
            <i class="fas fa-hammer"></i> Thu thập
          </button>

          <router-link
            :to="{ name: 'Minigame' }"
            class="btn-action btn-secondary text-center"
          >
            <i class="fas fa-arrow-left"></i> Rời đi
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const props = defineProps({
  resourceType: { type: String, required: true },
});

const loading = ref(true);
const error = ref(null);
const data = ref(null);
const log = ref("Sẵn sàng thu thập...");
const isGathering = ref(false);

async function fetchGatheringData() {
  loading.value = true;
  error.value = null;
  // MOCK: Giả lập fetch data
  try {
    // const response = await api.client.get(
    //   `/api/v1/gathering/${props.resourceType}`
    // );
    const mockData = {
      resourceIcon: "🌳",
      resourceName: "Gỗ Thô",
      requirementText: "Cần cuốc gỗ Level 10",
      gatherLevel: 8,
      expPercent: 55.2,
      energyCost: 1,
    };
    data.value = mockData;
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Không thể tải khu vực";
  } finally {
    loading.value = false;
  }
}

async function doGather() {
  isGathering.value = true;
  log.value = "Đang thu thập...";

  // MOCK: Giả lập POST request
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Giả lập kết quả thành công
    const result = {
      message: "Thu thập thành công 5 Gỗ Thô!",
      level: data.value.gatherLevel,
      expPercent: data.value.expPercent + 10,
    };

    if (result.expPercent >= 100) {
      result.level++;
      result.expPercent = 0;
      result.message += " 🎉 Lên Cấp!";
    }

    log.value = result.message;
    data.value.gatherLevel = result.level;
    data.value.expPercent = result.expPercent;
  } catch (err) {
    log.value = "Thu thập thất bại! Hết thể lực.";
  } finally {
    isGathering.value = false;
  }
}

onMounted(fetchGatheringData);
</script>

<style scoped>
/* Nút cơ bản */
.btn-action {
  @apply py-3 px-5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Nút thành công */
.btn-success {
  @apply bg-green-600 hover:bg-green-700;
}

/* Nút xám */
.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-600;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
