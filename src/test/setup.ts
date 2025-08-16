import '@testing-library/jest-dom'

// Mock Three.js WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    clearColor: () => {},
    clear: () => {},
    getExtension: () => null,
    getParameter: () => 4096,
    createShader: () => ({}),
    shaderSource: () => {},
    compileShader: () => {},
    createProgram: () => ({}),
    attachShader: () => {},
    linkProgram: () => {},
    useProgram: () => {},
    getShaderParameter: () => true,
    getProgramParameter: () => true,
    enable: () => {},
    disable: () => {},
    viewport: () => {},
    drawArrays: () => {},
    drawElements: () => {},
    createBuffer: () => ({}),
    bindBuffer: () => {},
    bufferData: () => {},
    createTexture: () => ({}),
    bindTexture: () => {},
    texImage2D: () => {},
    texParameteri: () => {},
    generateMipmap: () => {},
    getUniformLocation: () => ({}),
    uniform1i: () => {},
    uniform1f: () => {},
    uniform2f: () => {},
    uniform3f: () => {},
    uniform4f: () => {},
    uniformMatrix4fv: () => {},
    vertexAttribPointer: () => {},
    enableVertexAttribArray: () => {},
    getAttribLocation: () => 0,
  }),
  writable: true,
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0)
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}