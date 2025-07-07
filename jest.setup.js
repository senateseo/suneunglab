import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
}))

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        return <img {...props} />
    },
}))

// Mock next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, ...props }) => {
        return <a {...props}>{children}</a>
    },
})) 