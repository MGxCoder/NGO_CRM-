import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertDescription, AlertTitle } from '../app/components/ui/alert'

describe('Alert Component', () => {
  it('should render an alert', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    )
    expect(container.querySelector('[role="alert"]')).toBeDefined()
  })

  it('should render alert title', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
      </Alert>
    )
    expect(screen.getByText('Warning')).toBeDefined()
  })

  it('should render alert description', () => {
    render(
      <Alert>
        <AlertDescription>This is an alert message</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('This is an alert message')).toBeDefined()
  })

  it('should support different variants', () => {
    const { container } = render(
      <>
        <Alert>
          <AlertTitle>Default</AlertTitle>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Destructive</AlertTitle>
        </Alert>
      </>
    )
    expect(container.querySelectorAll('[role="alert"]').length).toBe(2)
  })

  it('should render complete alert structure', () => {
    render(
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error occurred while processing your request</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Error')).toBeDefined()
    expect(screen.getByText('An error occurred while processing your request')).toBeDefined()
  })
})
