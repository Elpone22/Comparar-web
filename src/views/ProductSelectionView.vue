<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import LocalProductCard from '../components/LocalProductCard.vue'

// Interfaces para productos en línea
interface OnlineProduct {
  id: number
  name: string
  image: string
  prices: Array<{
    store: string
    price: number
    url: string
    currency: string
  }>
}

// Interfaces para productos locales
interface LocalPrice {
  store: string
  price: number
  currency: string
  address?: string
  url?: string
}

interface LocalProduct {
  id: number
  name: string
  image: string
  prices: LocalPrice[]
}

// Estados
const onlineProducts = ref<OnlineProduct[]>([])
const localProducts = ref<LocalProduct[]>([])
const loading = ref(true)
const search = ref('')

// Cargar productos en línea
const loadOnlineProducts = async () => {
  try {
    const response = await fetch('/data/products.json')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    onlineProducts.value = data.products.map((product: any) => ({
      ...product,
      prices: [...product.prices].sort((a: any, b: any) => a.price - b.price)
    }))
  } catch (error) {
    console.error('Error al cargar productos en línea:', error)
  }
}

// Cargar productos locales
const loadLocalProducts = async () => {
  try {
    const response = await fetch('/data/local-products.json')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    localProducts.value = data.products.map((product: any) => ({
      ...product,
      prices: [...product.prices].sort((a: any, b: any) => a.price - b.price)
    }))
  } catch (error) {
    console.error('Error al cargar productos locales:', error)
  }
}

// Productos filtrados
const filteredOnlineProducts = computed(() => {
  return onlineProducts.value.filter(product =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const filteredLocalProducts = computed(() => {
  return localProducts.value.filter(product =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(async () => {
  await Promise.all([loadOnlineProducts(), loadLocalProducts()])
  loading.value = false
})
</script>

<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="search"
          label="Buscar productos para comparar..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="d-flex mx-auto my-12"
      size="64"
    ></v-progress-circular>

    <div v-else>
      <!-- Productos en línea -->
      <v-row v-if="filteredOnlineProducts.length > 0" class="mb-8">
        <v-col cols="12">
          <h2 class="text-h4 mb-4 text-center">Tiendas en Línea</h2>
        </v-col>
        <v-col
          v-for="product in filteredOnlineProducts"
          :key="`online-${product.id}`"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProductCard :product="product" :simple="true" />
        </v-col>
      </v-row>

      <!-- Productos locales -->
      <v-row v-if="filteredLocalProducts.length > 0" class="mb-8">
        <v-col cols="12">
          <h2 class="text-h4 mb-4 text-center">Tiendas Locales</h2>
        </v-col>
        <v-col
          v-for="product in filteredLocalProducts"
          :key="`local-${product.id}`"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <LocalProductCard :product="product" :simple="true" />
        </v-col>
      </v-row>

      <!-- Mensaje cuando no hay resultados -->
      <v-row v-if="!filteredOnlineProducts.length && !filteredLocalProducts.length" class="mb-8">
        <v-col cols="12" class="text-center py-12">
          <v-icon size="64" color="grey lighten-1">mdi-package-variant-remove</v-icon>
          <h3 class="text-h6 mt-4">No se encontraron productos</h3>
          <p class="text-body-2 text-grey">Intenta con otros términos de búsqueda</p>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
