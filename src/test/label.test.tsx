import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '../app/components/ui/label'

describe('Label Component', () => {
  it('should render a label element', () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label.tagName).toBe('LABEL')
  })

  it('should render label with text content', () => {
    render(<Label>Email Address</Label>)
    const label = screen.getByText('Email Address')
    expect(label.textContent).toBe('Email Address')
  })

  it('should support htmlFor prop', () => {
    render(<Label htmlFor="email-input">Email</Label>)
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email-input')
  })

  it('should support className prop', () => {
    const { container } = render(<Label className="custom-class">Label</Label>)
    const label = container.querySelector('label')
    expect(label?.className).toContain('custom-class')
  })

  it('should work with form elements', () => {
    render(
      <>
        <Label htmlFor="username">Username</Label>
        <Label htmlFor="password">Password</Label>
      </>
    )
    expect(screen.getByText('Username')).toBeDefined()
    expect(screen.getByText('Password')).toBeDefined()
  })
})
