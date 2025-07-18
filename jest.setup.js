import '@testing-library/jest-dom'

// The following line is the definitive fix for the 'fetch is not defined' error.
// It polyfills the 'fetch' API in the Node.js environment, which is required
// by 'next-test-api-route-handler' to execute network requests during tests.
require('next')
