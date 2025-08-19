// This is a type declaration file for Vuetify
declare module 'vuetify/styles' {
  import { VuetifyOptions } from 'vuetify'
  const styles: VuetifyOptions['styles']
  export default styles
}

declare module 'vuetify' {
  import { VuetifyOptions } from 'vuetify'
  const createVuetify: (options?: VuetifyOptions) => any
  export { createVuetify }
  export * from 'vuetify/components'
  export * from 'vuetify/directives'
}

declare module 'vuetify/components' {
  import { Component } from 'vue'
  const components: Record<string, Component>
  export default components
}

declare module 'vuetify/directives' {
  import { Directive } from 'vue'
  const directives: Record<string, Directive>
  export default directives
}
