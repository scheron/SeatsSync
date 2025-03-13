declare module "vue-router" {
  interface RouteMeta {
    /*** Determines if the route is for authenticated (`user`) or unauthenticated (`guest`) users. */
    requiredStatus?: "user" | "guest"
    /*** Hides the header on this route.  */
    hideHeader?: boolean
    /*** The title of the page.  */
    title?: string
    /*** The delay before showing the loading state.  */
    loadingShowDelay?: number
    /*** The timeout for the loading state. When the timeout is reached, if router.routerLoaded() doesn't get called, the loading state will be set to false.  */
    loadingHideTimeout?: number
    /*** If true, the page should call router.routerLoaded() manually.  */
    manualLoadingStop?: boolean
  }
}
