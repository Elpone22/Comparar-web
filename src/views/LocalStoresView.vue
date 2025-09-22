<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LocalProductCard from '../components/LocalProductCard.vue'

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

interface LocalProductsData {
  products: LocalProduct[]
}

const products = ref<LocalProduct[]>([])
const loading = ref(true)
const search = ref('')

const loadProducts = async () => {
  try {
    const response = await fetch('/data/local-products.json')
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const data: LocalProductsData = await response.json()
    // Ordenar precios de cada producto de menor a mayor
    products.value = data.products.map(p => ({
      ...p,
      prices: [...p.prices].sort((a, b) => a.price - b.price)
    }))
  } catch (err) {
    console.error('Error al cargar productos locales:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})

const filteredProducts = computed(() => {
  return products.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
})
</script>

<template>
  <v-container>
    <v-row class="mb-6" justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="search"
          label="Buscar productos locales..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="d-flex mx-auto my-12"
      size="64"
    />

    <v-row v-else>
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <LocalProductCard :product="product" />
      </v-col>

      <v-col v-if="!filteredProducts.length" cols="12" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-store-remove</v-icon>
        <h3 class="text-h6 mt-4">No se encontraron productos locales</h3>
        <p class="text-body-2 text-grey">Intenta con otros términos de búsqueda</p>
      </v-col>
    </v-row>
  </v-container>
</template>
