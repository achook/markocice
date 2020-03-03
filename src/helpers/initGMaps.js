const API_KEY = __GOOGLEKEY__ // eslint-disable-line no-undef
const CALLBACK_NAME = 'gmapsCallback'

let initialized = !!window.google
let resolveInitPromise, rejectInitPromise

const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve
  rejectInitPromise = reject
})

export default function init (visualization) {
  if (initialized) return initPromise

  initialized = true

  window[CALLBACK_NAME] = function () {
    resolveInitPromise(window.google)
  }

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}&libraries=visualization`
  script.onerror = rejectInitPromise
  document.querySelector('head').appendChild(script)

  return initPromise
}
