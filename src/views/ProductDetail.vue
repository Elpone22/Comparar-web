<template>
  <v-container v-if="product" class="py-8">
    <v-btn 
      color="primary" 
      class="mb-4" 
      prepend-icon="mdi-arrow-left"
      @click="goBack"
    >
      Volver
    </v-btn>

    <v-card class="mb-6">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-4 d-flex align-center">
          <v-img
            :src="selectedStore ? selectedStore.image || product.image : product.image"
            :alt="product.name"
            max-height="400"
            contain
            class="product-image"
            :class="{ 'elevation-4': true, 'transition-swing': true }"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" md="6" class="pa-6">
          <v-card-title class="text-h4 font-weight-bold mb-2">
            {{ product.name }}
          </v-card-title>
          
          <v-card-subtitle class="text-h6 mb-1">
            {{ selectedStore ? `Vista de ${selectedStore.store}` : 'Comparación de precios' }}
          </v-card-subtitle>
          
          <v-tabs v-model="activeTab" class="mb-4" bg-color="transparent" color="primary">
            <v-tab value="online">Tiendas en línea</v-tab>
            <v-tab value="local">Tiendas locales</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="online">
              <v-list class="mb-4">
                <v-list-item
                  v-for="(price, index) in sortedOnlinePrices"
                  :key="`online-${index}`"
                  :class="{ 'best-price': index === 0, 'store-selected': selectedOnlineIndex === index }"
                  class="mb-2 store-item"
                  @click="selectOnline(index)"
                  :ripple="true"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="index === 0 ? 'green-lighten-4' : 'grey-lighten-4'" size="48">
                      <span class="text-h6">{{ index + 1 }}°</span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 font-weight-medium">
                    {{ price.store }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="text-right">
                    <span class="text-h5 font-weight-bold" :class="{ 'text-green-darken-2': index === 0 }">
                      {{ formatPrice(price.price) }}
                    </span>
                    <v-chip 
                      v-if="index === 0" 
                      color="green" 
                      size="small" 
                      class="ml-2"
                      text-color="white"
                    >
                      Mejor precio
                    </v-chip>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                      :href="price.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      variant="flat"
                      class="ml-4"
                    >
                      Ver
                      <v-icon end>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>

            <v-window-item value="local">
              <v-alert v-if="!product.localPrices || product.localPrices.length === 0" type="info" variant="tonal" class="mb-4">
                Aún no hay datos de tiendas locales para este producto.
              </v-alert>

              <v-list v-else class="mb-4">
                <v-list-item
                  v-for="(price, index) in sortedLocalPrices"
                  :key="`local-${index}`"
                  :class="{ 'best-price': index === 0, 'store-selected': selectedLocalIndex === index }"
                  class="mb-2 store-item"
                  @click="selectLocal(index)"
                  :ripple="true"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="index === 0 ? 'green-lighten-4' : 'grey-lighten-4'" size="48">
                      <span class="text-h6">{{ index + 1 }}°</span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 font-weight-medium">
                    {{ price.store }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    <div class="d-flex flex-column align-end w-100">
                      <span class="text-h5 font-weight-bold" :class="{ 'text-green-darken-2': index === 0 }">
                        {{ formatPrice(price.price) }}
                      </span>
                      <small v-if="price.address" class="text-grey">{{ price.address }}</small>
                    </div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-btn
                      v-if="price.url"
                      :href="price.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      variant="flat"
                      class="ml-4"
                    >
                      Ver
                      <v-icon end>mdi-open-in-new</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-1">Ahorro potencial</div>
              <div class="text-h5 font-weight-bold text-green-darken-2">
                {{ calculateSavings() }}
              </div>
            </div>
            <v-btn
              v-if="bestDeal && activeTab === 'online' && bestDeal.url"
              :href="bestDeal.url"
              target="_blank"
              rel="noopener noreferrer"
              color="success"
              size="large"
              class="px-6"
            >
              Comprar al mejor precio
              <v-icon end>mdi-cart-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-card-title class="text-h5 mb-4">
        Detalles del producto
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item v-for="(price, index) in product.prices" :key="index">
                <v-list-item-title class="font-weight-medium">
                  {{ price.store }}:
                  <span class="text-body-1">
                    {{ formatPrice(price.price) }}
                    <v-chip 
                      v-if="index === 0" 
                      color="green" 
                      size="small" 
                      class="ml-2"
                      text-color="white"
                    >
                      Mejor oferta
                    </v-chip>
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item>
                <v-list-item-title class="font-weight-medium">
                  Precio promedio:
                  <span class="text-body-1">
                    {{ formatPrice(averagePrice) }}
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-medium">
                  Precio más bajo:
                  <span class="text-body-1 text-green-darken-2">
                    {{ formatPrice(lowestPrice) }}
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-medium">
                  Precio más alto:
                  <span class="text-body-1 text-red-darken-2">
                    {{ formatPrice(highestPrice) }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  
  <v-container v-else class="text-center py-12">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <p class="mt-4">Cargando información del producto...</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Price {
  store: string
  price: number
  url: string
  currency: string
  image?: string // Imagen específica de la tienda (opcional)
  address?: string // Para tiendas locales (opcional)
}

interface Product {
  id: number
  name: string
  image: string
  prices: Price[]
  localPrices?: Price[]
}

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const loading = ref(true)
const activeTab = ref<'online' | 'local'>('online')
const selectedOnlineIndex = ref<number | null>(null)
const selectedLocalIndex = ref<number | null>(null)
const selectedStore = ref<Price | null>(null)

// Seleccionar tienda (online)
const selectOnline = (index: number) => {
  selectedOnlineIndex.value = index
  if (product.value) {
    selectedStore.value = { ...sortedOnlinePrices.value[index] }
  }
}

// Seleccionar tienda (local)
const selectLocal = (index: number) => {
  selectedLocalIndex.value = index
  if (product.value && sortedLocalPrices.value.length > index) {
    selectedStore.value = { ...sortedLocalPrices.value[index] }
  }
}

// Obtener ícono según la tienda
// const getStoreIcon = (storeName: string) => {
//   const storeIcons: { [key: string]: string } = {
//     'Amazon': 'mdi-amazon',
//     'eBay': 'mdi-ebay',
//     'Mercado Libre': 'mdi-cart',
//     'Walmart': 'mdi-cart',
//     'Best Buy': 'mdi-cart',
//     'Target': 'mdi-target',
//     'Home Depot': 'mdi-home',
//     'Lowe\'s': 'mdi-home',
//     'Costco': 'mdi-warehouse',
//     'Sam\'s Club': 'mdi-warehouse',
//   }
//   return storeIcons[storeName] || 'mdi-store'
// }

// Obtener clase CSS según la tienda
// const getStoreBadgeClass = (storeName: string) => {
//   const storeClasses: { [key: string]: string } = {
//     'Amazon': 'amazon-badge',
//     'eBay': 'ebay-badge',
//     'Mercado Libre': 'ml-badge',
//     'Walmart': 'walmart-badge',
//     'Best Buy': 'bestbuy-badge',
//   }
//   return storeClasses[storeName] || 'default-badge'
// }

const goBack = () => {
  router.go(-1)
}

// Obtener productos del JSON
const loadProduct = async () => {
  try {
    const response = await fetch('/data/products.json')
    const data = await response.json()
    const productId = Number(route.params.id)
    const foundProduct = data.products.find((p: Product) => p.id === productId)
    
    if (foundProduct) {
      // Ordenar precios de menor a mayor
      foundProduct.prices.sort((a: Price, b: Price) => a.price - b.price)
      if (foundProduct.localPrices) {
        foundProduct.localPrices.sort((a: Price, b: Price) => a.price - b.price)
      }
      product.value = foundProduct
    } else {
      // Redirigir a la página de inicio si no se encuentra el producto
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Error al cargar el producto:', error)
  } finally {
    loading.value = false
  }
}

// Propiedades computadas
const sortedOnlinePrices = computed(() => {
  return product.value ? [...product.value.prices].sort((a, b) => a.price - b.price) : []
})

const sortedLocalPrices = computed(() => {
  return product.value && product.value.localPrices ? [...product.value.localPrices].sort((a, b) => a.price - b.price) : []
})

const bestDeal = computed(() => {
  if (activeTab.value === 'online') {
    return sortedOnlinePrices.value.length > 0 ? sortedOnlinePrices.value[0] : null
  } else {
    return sortedLocalPrices.value.length > 0 ? sortedLocalPrices.value[0] : null
  }
})

const averagePrice = computed(() => {
  if (!product.value || product.value.prices.length === 0) return 0
  const total = product.value.prices.reduce((sum, price) => sum + price.price, 0)
  return total / product.value.prices.length
})

const lowestPrice = computed(() => {
  if (!product.value || product.value.prices.length === 0) return 0
  return Math.min(...product.value.prices.map(p => p.price))
})

const highestPrice = computed(() => {
  if (!product.value || product.value.prices.length === 0) return 0
  return Math.max(...product.value.prices.map(p => p.price))
})

// Métodos
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price)
}

const calculateSavings = () => {
  if (!product.value) return formatPrice(0)
  
  const list = activeTab.value === 'online' ? (product.value.prices || []) : (product.value.localPrices || [])
  if (list.length < 2) return formatPrice(0)

  const prices = list.map(p => p.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const savings = maxPrice - minPrice
  
  return formatPrice(savings)
}


// Cargar el producto cuando se monte el componente
onMounted(async () => {
  await loadProduct()
  // Seleccionar automáticamente la primera tienda al cargar
  if (product.value && product.value.prices.length > 0) {
    selectOnline(0)
  }
})
</script>

<style scoped>
.product-image {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.store-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 2px solid transparent;
}

.store-item:hover {
  background-color: #f5f5f5;
}

.store-selected {
  border-color: #1976d2;
  background-color: #e3f2fd;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.best-price {
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background-color: #F1F8E9;
  transition: all 0.3s ease;
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: #f5f5f5;
}

.v-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-img {
  transition: transform 0.3s ease;
}

.v-img:hover {
  transform: scale(1.05);
}
</style>
