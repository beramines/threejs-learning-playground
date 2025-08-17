import '@testing-library/jest-dom'

// Mock Three.js WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function(contextType: string) {
    return {
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
    };
  },
  writable: true,
});

// Mock ResizeObserver
(globalThis as any).ResizeObserver = function() {} as any;
(globalThis as any).ResizeObserver.prototype.observe = function() {};
(globalThis as any).ResizeObserver.prototype.unobserve = function() {};
(globalThis as any).ResizeObserver.prototype.disconnect = function() {};

// Mock requestAnimationFrame
(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0)
}

(globalThis as any).cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}