import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCategories = [
  {
    id: 'basics',
    title: 'Basic Shapes',
    description: '基本的な立体形状',
    icon: 'Box'
  },
  {
    id: 'geometries',
    title: 'Geometries',
    description: '様々なジオメトリ',
    icon: 'Shapes'
  }
]

const defaultProps = {
  isOpen: true,
  categories: mockCategories,
  currentCategory: 'basics',
  onCategorySelect: vi.fn(),
  onToggle: vi.fn()
}

const renderWithRouter = (props = {}) => {
  return render(
    <BrowserRouter>
      <Sidebar {...defaultProps} {...props} />
    </BrowserRouter>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders category buttons', () => {
    renderWithRouter()
    
    expect(screen.getByText('Basic Shapes')).toBeInTheDocument()
    expect(screen.getByText('Geometries')).toBeInTheDocument()
  })

  it('highlights current category', () => {
    renderWithRouter({ currentCategory: 'basics' })
    
    const activeButton = screen.getByText('Basic Shapes').closest('button')
    expect(activeButton).toHaveClass('bg-blue-600')
  })

  it('navigates to category when clicked', () => {
    renderWithRouter()
    
    const geometriesButton = screen.getByText('Geometries')
    fireEvent.click(geometriesButton)
    
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith('geometries')
    expect(mockNavigate).toHaveBeenCalledWith('/category/geometries')
  })

  it('shows collapsed view when closed', () => {
    renderWithRouter({ isOpen: false })
    
    expect(screen.queryByText('Basic Shapes')).not.toBeInTheDocument()
    expect(screen.getByText('3JS')).toBeInTheDocument()
  })

  it('calls onToggle when toggle button is clicked', () => {
    const mockOnToggle = vi.fn()
    renderWithRouter({ onToggle: mockOnToggle })
    
    // Get the first button (toggle button)
    const toggleButton = screen.getAllByRole('button')[0]
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalled()
  })
})