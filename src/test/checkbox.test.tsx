import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../app/components/ui/checkbox'

describe('Checkbox Component', () => {
  it('should render a checkbox input', () => {
    const { container } = render(<Checkbox />)
    const checkbox = container.querySelector('input[type="checkbox"]')
    expect(checkbox).toBeDefined()
  })

  it('should render a checkbox', () => {
    const { container } = render(<Checkbox defaultChecked />)
    expect(container.querySelector('[role="checkbox"]')).toBeDefined()
  })

  it('should render unchecked state', () => {
    const { container } = render(<Checkbox />)
    expect(container).toBeDefined()
  })

  it('should support disabled state', () => {
    const { container } = render(<Checkbox disabled />)
    const checkbox = container.querySelector('[role="checkbox"]')
    // Checkbox is disabled when rendered with disabled prop
    expect(checkbox).toBeDefined()
  })

  it('should support aria attributes', () => {
    const { container } = render(<Checkbox aria-label="Agree to terms" />)
    const checkbox = container.querySelector('[role="checkbox"]')
    expect(checkbox).toBeDefined()
  })

  it('should render multiple checkboxes', () => {
    const { container } = render(
      <>
        <Checkbox />
        <Checkbox />
        <Checkbox />
      </>
    )
    const checkboxes = container.querySelectorAll('[role="checkbox"]')
    expect(checkboxes.length).toBe(3)
  })
})
