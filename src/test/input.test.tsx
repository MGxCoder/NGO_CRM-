import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '../app/components/ui/input'

describe('Input Component', () => {
  it('should render an input element', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDefined()
  })

  it('should have correct input type', () => {
    render(<Input type="email" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('email')
  })

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeDefined()
  })

  it('should support disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('should support value prop', () => {
    render(<Input value="test value" readOnly />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('test value')
  })

  it('should support different input types', () => {
    const { container } = render(
      <>
        <Input type="text" placeholder="text" />
        <Input type="email" placeholder="email" />
        <Input type="password" placeholder="password" />
        <Input type="number" placeholder="number" />
      </>
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs.length).toBe(4)
  })
})
