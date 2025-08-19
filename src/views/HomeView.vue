<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'

interface Product {
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

const products = ref<Product[]>([])
const loading = ref(true)
const search = ref('')

// Ordenar productos por el precio más bajo
const sortedProducts = computed(() => {
  return [...products.value].map(product => {
    // Ordenar precios de menor a mayor
    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price)
    return { ...product, prices: sortedPrices }
  }).filter(product => 
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Interfaz para los datos del JSON
interface ProductsData {
  products: Product[]
}

// Cargar productos desde el JSON
const loadProducts = async () => {
  try {
    // Usamos fetch para cargar el JSON
    const response = await fetch('/src/data/products.json')
    const data: ProductsData = await response.json()
    products.value = data.products
  } catch (error) {
    console.error('Error al cargar los productos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="search"
          label="Buscar productos..."
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

    <v-row v-else>
      <v-col
        v-for="product in sortedProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" />
      </v-col>

      <v-col v-if="!sortedProducts.length" cols="12" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-package-variant-remove</v-icon>
        <h3 class="text-h6 mt-4">No se encontraron productos</h3>
        <p class="text-body-2 text-grey">Intenta con otros términos de búsqueda</p>
      </v-col>
    </v-row>
  </v-container>
</template>
