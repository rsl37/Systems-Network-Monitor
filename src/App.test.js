import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Systems Network Monitor header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Systems Network Monitor/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders system type selector', () => {
  render(<App />);
  const supplyChainButton = screen.getByText(/Supply Chain/i);
  const atcButton = screen.getByText(/Air Traffic Control/i);
  expect(supplyChainButton).toBeInTheDocument();
  expect(atcButton).toBeInTheDocument();
});
