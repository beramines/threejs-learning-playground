import { describe, it, expect } from 'vitest'
import { categories } from '../index'

describe('Categories', () => {
  it('has correct number of categories', () => {
    expect(categories).toHaveLength(12)
  })

  it('has all required category properties', () => {
    categories.forEach(category => {
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('title')
      expect(category).toHaveProperty('description')
      expect(category).toHaveProperty('icon')
      
      expect(typeof category.id).toBe('string')
      expect(typeof category.title).toBe('string')
      expect(typeof category.description).toBe('string')
      expect(typeof category.icon).toBe('string')
    })
  })

  it('has unique category IDs', () => {
    const ids = categories.map(cat => cat.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(categories.length)
  })

  it('includes expected categories', () => {
    const expectedIds = [
      'basics', 'geometries', 'materials', 'lights', 
      'cameras', 'animations', 'textures', 'shaders',
      'postprocessing', 'physics', 'performance', 'advanced'
    ]
    
    const categoryIds = categories.map(cat => cat.id)
    
    expectedIds.forEach(expectedId => {
      expect(categoryIds).toContain(expectedId)
    })
  })
})