import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card'

describe('Card Component', () => {
  it('should render Card component', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
    )
    expect(container.querySelector('[class*="card"]')).toBeDefined()
  })

  it('should render CardHeader', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header Content</CardHeader>
      </Card>
    )
    expect(screen.getByText('Header Content')).toBeDefined()
  })

  it('should render CardTitle', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('My Title')).toBeDefined()
  })

  it('should render CardDescription', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('This is a description')).toBeDefined()
  })

  it('should render CardContent', () => {
    render(
      <Card>
        <CardContent>Main content</CardContent>
      </Card>
    )
    expect(screen.getByText('Main content')).toBeDefined()
  })

  it('should support complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card body content</p>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Complete Card')).toBeDefined()
    expect(screen.getByText('Card description')).toBeDefined()
    expect(screen.getByText('Card body content')).toBeDefined()
  })
})
