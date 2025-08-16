import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import React from 'react'

// Mock the complex components that require WebGL
vi.mock('../components/HomePage', () => ({
  default: () => <div>HomePage</div>
}))

vi.mock('../components/CategoryView', () => ({
  default: () => <div>CategoryView</div>
}))

vi.mock('../components/SampleViewer', () => ({
  default: () => <div>SampleViewer</div>
}))

vi.mock('../components/layout/Sidebar', () => ({
  default: () => <div>Sidebar</div>
}))

vi.mock('../components/layout/Header', () => ({
  default: () => <div>Header</div>
}))

// Mock all sample modules
const mockSamples = { default: {} }
vi.mock('../samples/basics', () => mockSamples)
vi.mock('../samples/geometries', () => mockSamples)
vi.mock('../samples/materials', () => mockSamples)
vi.mock('../samples/lights', () => mockSamples)
vi.mock('../samples/cameras', () => mockSamples)
vi.mock('../samples/animations', () => mockSamples)
vi.mock('../samples/textures', () => mockSamples)
vi.mock('../samples/shaders', () => mockSamples)
vi.mock('../samples/postprocessing', () => mockSamples)
vi.mock('../samples/physics', () => mockSamples)
vi.mock('../samples/performance', () => mockSamples)
vi.mock('../samples/advanced', () => mockSamples)

// Import the components we need for testing
import HomePage from '../components/HomePage'
import CategoryView from '../components/CategoryView'
import SampleViewer from '../components/SampleViewer'

// Create test routes component (without BrowserRouter)
const TestRoutes = () => (
  <Routes>
    <Route path="/" element={<div>Root</div>} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/category/:categoryId" element={<CategoryView />} />
    <Route path="/category/:categoryId/:sampleId" element={<SampleViewer />} />
  </Routes>
)

describe('App Routing', () => {
  it('renders home page at /home', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <TestRoutes />
      </MemoryRouter>
    )
    
    expect(screen.getByText('HomePage')).toBeInTheDocument()
  })

  it('renders category view at /category/:categoryId', () => {
    render(
      <MemoryRouter initialEntries={['/category/basics']}>
        <TestRoutes />
      </MemoryRouter>
    )
    
    expect(screen.getByText('CategoryView')).toBeInTheDocument()
  })

  it('renders sample viewer at /category/:categoryId/:sampleId', () => {
    render(
      <MemoryRouter initialEntries={['/category/basics/cube']}>
        <TestRoutes />
      </MemoryRouter>
    )
    
    expect(screen.getByText('SampleViewer')).toBeInTheDocument()
  })
})