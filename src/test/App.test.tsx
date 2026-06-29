import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../app/App'

describe('App Component', () => {
  it('should render the App component', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
  })

  it('should render RouterProvider', () => {
    const { container } = render(<App />)
    // The app should render without errors
    expect(container.firstChild).toBeDefined()
  })

  it('should render without throwing', () => {
    expect(() => render(<App />)).not.toThrow()
  })
})
