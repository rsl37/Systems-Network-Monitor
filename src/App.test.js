import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Systems Network Monitor header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Systems Network Monitor/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders system type selector buttons', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThanOrEqual(2);
  expect(screen.getByRole('button', { name: /Supply Chain/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Air Traffic Control/i })).toBeInTheDocument();
});

test('renders alert panel', () => {
  render(<App />);
  const alertHeading = screen.getByText(/Active Alerts/i);
  expect(alertHeading).toBeInTheDocument();
});
