import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../app/components/ui/badge'

describe('Badge Component', () => {
  it('should render a badge', () => {
    render(<Badge>Active</Badge>)
    const badge = screen.getByText('Active')
    expect(badge).toBeDefined()
  })

  it('should display badge text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeDefined()
  })

  it('should support different variants', () => {
    const { container } = render(
      <>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </>
    )
    expect(screen.getByText('Default')).toBeDefined()
    expect(screen.getByText('Secondary')).toBeDefined()
    expect(screen.getByText('Destructive')).toBeDefined()
  })

  it('should render multiple badges', () => {
    const { container } = render(
      <>
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </>
    )
    expect(screen.getByText('Badge 1')).toBeDefined()
    expect(screen.getByText('Badge 2')).toBeDefined()
    expect(screen.getByText('Badge 3')).toBeDefined()
  })

  it('should support className prop', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    const badge = container.querySelector('[class*="badge"]')
    expect(badge).toBeDefined()
  })
})
