<template lang="pug">
  body#app
    #nav
      router-link(:to="{name: 'statsMap'}") Mapa
      router-link(:to="{name: 'home'}", exact) Strona główna
      router-link(:to="{name: 'search'}") Szukaj
    router-view
</template>

<style lang="scss">
html {
  height: 100%;

  font-size: 16px;

  @media screen and (min-width: 320px) {
    font-size: calc(16px + 4 * ((100vw - 320px) / 880));
  }

  @media screen and (min-width: 1200px) {
    font-size: 20px;
  }
}

body {
  min-height: 100vh;

  margin: 0;
  padding: 0;

  background-color: #f0f0f0;

  font-size: 100%;
  text-align: center;
  color: #2d3436;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
    Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

#nav {
  width: 100%;
  top: 0;

  position: sticky;
  z-index: 100;

  margin-bottom: 15px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: #00b894;

  a {
    padding: 15px;

    font-weight: bold;
    color: #f0f0f0;

    @media screen and (min-width: 320px) {
      padding: calc(15px + 15 * ((100vw - 320px) / 880));
    }

    @media screen and (min-width: 1200px) {
      padding: 30px;
    }

    &.router-link-active {
      color: #2d3436;
    }
  }
}

input, textarea {
  font-family: inherit;
}
</style>
