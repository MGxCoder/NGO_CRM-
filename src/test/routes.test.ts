import { describe, it, expect } from 'vitest'
import { router } from '../app/routes'

describe('Routes Configuration', () => {
  it('should have router defined', () => {
    expect(router).toBeDefined()
  })

  it('should have root route with LoginPage', () => {
    const rootRoute = router.routes[0]
    expect(rootRoute).toBeDefined()
    expect(rootRoute.path).toBe('/')
  })

  it('should have dashboard route with children', () => {
    const dashboardRoute = router.routes[1]
    expect(dashboardRoute).toBeDefined()
    expect(dashboardRoute.path).toBe('/dashboard')
    expect(dashboardRoute.children).toBeDefined()
    expect(dashboardRoute.children?.length).toBeGreaterThan(0)
  })

  it('should have all required dashboard child routes', () => {
    const dashboardRoute = router.routes[1]
    const childPaths = dashboardRoute.children?.map(route => route.path).filter(Boolean)
    
    const expectedPaths = ['donors', 'donors/add', 'impact-stories', 'impact-stories/add', 'reports', 'engagement', 'campaigns', 'ai-assistant', 'analytics', 'settings']
    
    expectedPaths.forEach(path => {
      expect(childPaths).toContain(path)
    })
  })

  it('should have at least 2 main routes', () => {
    expect(router.routes.length).toBeGreaterThanOrEqual(2)
  })
})
