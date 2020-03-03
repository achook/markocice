import { shallowMount } from '@vue/test-utils'
import err404 from '@/views/404.vue'

describe('404.vue', () => {
  it('returns error with correct path', () => {
    const $route = {
      fullPath: '/some/path'
    }

    const wrapper = shallowMount(err404, {
      mocks: {
        $route
      }
    })

    expect(wrapper.find('.error--path').text()).toEqual($route.fullPath)
  })
})
