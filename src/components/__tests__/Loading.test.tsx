import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loading from '../Loading'

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />)
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    const { container } = render(<Loading />)
    const loadingElement = container.firstChild as HTMLElement
    
    expect(loadingElement).toHaveClass('flex', 'items-center', 'justify-center', 'h-full')
  })
})