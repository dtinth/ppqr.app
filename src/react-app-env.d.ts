/// <reference types="react-scripts" />

declare module 'react-snapshot' {
  export const render: (typeof import('react-dom'))['render']
}
