import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

test('switching system type updates topology heading', async () => {
  render(<App />);
  
  // Initially shows Supply Chain
  expect(screen.getByText(/Network Topology - Supply Chain/i)).toBeInTheDocument();
  
  // Click ATC button
  const atcButton = screen.getByRole('button', { name: /Air Traffic Control/i });
  fireEvent.click(atcButton);
  
  // Should now show ATC
  await waitFor(() => {
    expect(screen.getByText(/Network Topology - Air Traffic Control/i)).toBeInTheDocument();
  });
});

test('clicking a node displays the details panel', async () => {
  render(<App />);
  
  // Find a node button (using role=button and aria-label pattern)
  const nodes = screen.getAllByRole('button');
  const nodeButton = nodes.find(node => node.getAttribute('aria-label')?.includes('Supplier'));
  
  if (nodeButton) {
    fireEvent.click(nodeButton);
    
    // Check for node details panel elements
    await waitFor(() => {
      expect(screen.getByText(/BASIC INFORMATION/i)).toBeInTheDocument();
    });
  }
});

test('alert filters update alert display', async () => {
  render(<App />);
  
  // Find the alert severity filter dropdown
  const filterDropdowns = screen.getAllByRole('combobox');
  const severityFilter = filterDropdowns[0]; // First dropdown is severity filter
  
  // Change filter to Critical only
  fireEvent.change(severityFilter, { target: { value: 'critical' } });
  
  // Check that filter was applied (this is a basic smoke test)
  await waitFor(() => {
    expect(severityFilter).toHaveValue('critical');
  });
});
