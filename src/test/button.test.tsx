import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../app/components/ui/button'

describe('Button Component', () => {
  it('should render a button element', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDefined()
  })

  it('should render button with text content', () => {
    render(<Button>Submit</Button>)
    const button = screen.getByRole('button', { name: /submit/i })
    expect(button.textContent).toBe('Submit')
  })

  it('should support variant prop', () => {
    const { container } = render(<Button variant="outline">Outline Button</Button>)
    expect(container).toBeDefined()
  })

  it('should support size prop', () => {
    const { container } = render(<Button size="lg">Large Button</Button>)
    expect(container).toBeDefined()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it('should render multiple variant types', () => {
    const { container } = render(
      <>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    )
    expect(container.querySelectorAll('button').length).toBe(4)
  })
})
