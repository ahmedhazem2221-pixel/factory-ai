import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders search input and filters machines', () => {
  render(<App />);
  
  // Verify search input is present
  const searchInput = screen.getByPlaceholderText(/search by name or status/i);
  expect(searchInput).toBeInTheDocument();

  // Initially, all machines should be listed (e.g. CNC Panel Saw and Edge Banding Machine)
  expect(screen.getByText('CNC Panel Saw')).toBeInTheDocument();
  expect(screen.getByText('Edge Banding Machine')).toBeInTheDocument();

  // Search for "CNC" - should only show CNC machines
  fireEvent.change(searchInput, { target: { value: 'CNC' } });
  expect(screen.getByText('CNC Panel Saw')).toBeInTheDocument();
  expect(screen.getByText('CNC Router')).toBeInTheDocument();
  expect(screen.queryByText('Edge Banding Machine')).not.toBeInTheDocument();

  // Search by status - "under maintenance"
  fireEvent.change(searchInput, { target: { value: 'under maintenance' } });
  expect(screen.getByText('CNC Router')).toBeInTheDocument();
  expect(screen.queryByText('CNC Panel Saw')).not.toBeInTheDocument();

  // Search for non-existent machine - should show "No machines found"
  fireEvent.change(searchInput, { target: { value: 'InvalidMachineXYZ' } });
  expect(screen.getByText('No machines found')).toBeInTheDocument();

  // Clear search using clear button
  const clearBtn = screen.getByRole('button', { name: '✕' });
  fireEvent.click(clearBtn);
  expect(screen.getByText('CNC Panel Saw')).toBeInTheDocument();
  expect(screen.getByText('Edge Banding Machine')).toBeInTheDocument();
});

test('allows adding a new machine to the system', () => {
  render(<App />);

  // Click "+ Add Machine" button
  const addButton = screen.getByRole('button', { name: /\+ add machine/i });
  fireEvent.click(addButton);

  // Check that the form renders
  expect(screen.getByText('Add New Machine')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('e.g. Laser Cutter')).toBeInTheDocument();

  // Try submitting with empty fields
  const submitButton = screen.getByRole('button', { name: /^add machine$/i });
  fireEvent.click(submitButton);
  expect(screen.getByText('Machine Name is required')).toBeInTheDocument();
  expect(screen.getByText('Model is required')).toBeInTheDocument();
  expect(screen.getByText('Location is required')).toBeInTheDocument();

  // Fill in fields
  fireEvent.change(screen.getByPlaceholderText('e.g. Laser Cutter'), { target: { value: 'Laser Cutter' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. Trumpf TruLaser 3030'), { target: { value: 'TruLaser 3030' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. Factory E - Fabrication'), { target: { value: 'Factory E' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. Laser Source, Cutting Head, CNC Controller'), { target: { value: 'Laser Source, Cutting Head' } });

  // Submit form
  fireEvent.click(submitButton);

  // The new machine should be added to the list and selected
  expect(screen.getAllByText('Laser Cutter').length).toBe(2);
  expect(screen.getByText(/TruLaser 3030.*Factory E/)).toBeInTheDocument();

  // Components should be rendered
  // Go to components tab
  const componentsTab = screen.getByRole('button', { name: /components/i });
  fireEvent.click(componentsTab);
  expect(screen.getByText('Laser Source')).toBeInTheDocument();
  expect(screen.getByText('Cutting Head')).toBeInTheDocument();
});

test('allows editing an existing machine, its specs, and repair history', () => {
  render(<App />);

  // Select CNC Panel Saw
  fireEvent.click(screen.getByText('CNC Panel Saw'));

  // Click "Edit" button in header
  const editButton = screen.getByRole('button', { name: /edit/i });
  fireEvent.click(editButton);

  // Check form renders and is populated
  expect(screen.getByText('Edit Machine')).toBeInTheDocument();
  const nameInput = screen.getByDisplayValue('CNC Panel Saw');
  expect(nameInput).toBeInTheDocument();

  // Modify some fields
  fireEvent.change(nameInput, { target: { value: 'CNC Panel Saw Upgraded' } });
  
  // Add a new repair history item
  const addRepairButton = screen.getByRole('button', { name: /\+ add repair record/i });
  fireEvent.click(addRepairButton);

  // Enter details for the new repair
  const issuesInputs = screen.getAllByPlaceholderText('Describe the issue');
  // We added a new row at the end, so the last input in issuesInputs is the one we want
  const newIssueInput = issuesInputs[issuesInputs.length - 1];
  fireEvent.change(newIssueInput, { target: { value: 'Belt replaced' } });

  // Save changes
  const saveButton = screen.getByRole('button', { name: /save changes/i });
  fireEvent.click(saveButton);

  // Check that the machine list has the updated name
  expect(screen.getAllByText('CNC Panel Saw Upgraded').length).toBe(2);

  // Go to repairs tab and verify new repair is shown
  const repairsTab = screen.getByRole('button', { name: /repairs/i });
  fireEvent.click(repairsTab);
  expect(screen.getByText('Belt replaced')).toBeInTheDocument();
});

test('allows logging a new repair directly from the Repairs tab', () => {
  render(<App />);

  // Select CNC Panel Saw
  fireEvent.click(screen.getByText('CNC Panel Saw'));

  // Go to repairs tab
  const repairsTab = screen.getByRole('button', { name: /repairs/i });
  fireEvent.click(repairsTab);

  // Click "+ Log New Repair" button
  const logButton = screen.getByRole('button', { name: /\+ log new repair/i });
  fireEvent.click(logButton);

  // Enter details
  fireEvent.change(screen.getByPlaceholderText('Describe the issue'), { target: { value: 'Faulty heating element' } });
  fireEvent.change(screen.getByPlaceholderText('Describe action taken'), { target: { value: 'Replaced element and tested' } });
  fireEvent.change(screen.getByPlaceholderText('Technician name'), { target: { value: 'Karim A.' } });

  // Save
  const saveBtn = screen.getByRole('button', { name: /save repair/i });
  fireEvent.click(saveBtn);

  // Verify the new repair is listed in the Repairs tab immediately
  expect(screen.getByText('Faulty heating element')).toBeInTheDocument();
  expect(screen.getByText('Action: Replaced element and tested')).toBeInTheDocument();
  // Technician name may appear in multiple entries (existing + new), so allow multiple
  expect(screen.getAllByText('Technician: Karim A.').length).toBeGreaterThanOrEqual(1);

  // Go to overview and verify total repairs count updated from 3 to 4
  const overviewTab = screen.getByRole('button', { name: /overview/i });
  fireEvent.click(overviewTab);
  expect(screen.getByText('4')).toBeInTheDocument(); // total repairs
});

test('shows active fault banner for under-maintenance machine and Mark as Fixed resolves it', () => {
  render(<App />);

  // Select the CNC Router which is under maintenance with an active fault
  fireEvent.click(screen.getByText('CNC Router'));

  // The active fault banner should be visible
  expect(screen.getByText(/Active Fault/i)).toBeInTheDocument();
  expect(screen.getByText(/Spindle motor overheating/i)).toBeInTheDocument();
  expect(screen.getAllByText('Hassan M.').length).toBeGreaterThanOrEqual(1);

  // The Mark as Fixed button should be present
  const markFixedBtn = screen.getByRole('button', { name: /mark as fixed/i });
  expect(markFixedBtn).toBeInTheDocument();

  // Click Mark as Fixed
  fireEvent.click(markFixedBtn);

  // The fault banner should be gone
  expect(screen.queryByText(/Active Fault/i)).not.toBeInTheDocument();

  // The machine status badge should now show Operational
  expect(screen.getAllByText('Operational').length).toBeGreaterThan(0);

  // The fault resolution should appear in repair history
  const repairsTab = screen.getByRole('button', { name: /repairs/i });
  fireEvent.click(repairsTab);
  expect(screen.getByText(/Fault resolved and machine returned to operational status/i)).toBeInTheDocument();
});

test('handles faulty status, yellow banner, carrying over fault description to under maintenance, and Mark as Fixed', () => {
  render(<App />);

  // Select CNC Panel Saw
  fireEvent.click(screen.getByText('CNC Panel Saw'));

  // Edit machine to set status to faulty
  const editButton = screen.getByRole('button', { name: /edit/i });
  fireEvent.click(editButton);

  // Change status to faulty and provide a fault description
  const statusSelect = screen.getByDisplayValue('Operational');
  fireEvent.change(statusSelect, { target: { value: 'faulty' } });
  
  const faultInput = screen.getByPlaceholderText(/describe the active fault/i);
  fireEvent.change(faultInput, { target: { value: 'Blade motor stuttering' } });

  // Save changes
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  // Verify yellow warning banner is displayed with no technician and no Mark as Fixed button
  expect(screen.getByText(/Active Fault Reported/i)).toBeInTheDocument();
  expect(screen.getByText('Blade motor stuttering')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /mark as fixed/i })).not.toBeInTheDocument();
  expect(screen.getAllByText('Faulty').length).toBeGreaterThan(0);

  // Edit machine again and change status to under maintenance
  fireEvent.click(screen.getByRole('button', { name: /edit/i }));
  const statusSelect2 = screen.getByDisplayValue('Faulty');
  fireEvent.change(statusSelect2, { target: { value: 'under maintenance' } });

  // Verify fault description carried over automatically
  const faultInput2 = screen.getByPlaceholderText(/describe the active fault/i);
  expect(faultInput2.value).toBe('Blade motor stuttering');

  // Assign a technician
  const techInput = screen.getByPlaceholderText(/e\.g\. Hassan M\./i);
  fireEvent.change(techInput, { target: { value: 'Karim A.' } });

  // Save changes
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  // Verify red banner with Mark as Fixed button and technician
  expect(screen.getByRole('button', { name: /mark as fixed/i })).toBeInTheDocument();
  expect(screen.getAllByText('Karim A.').length).toBeGreaterThanOrEqual(1);

  // Mark as Fixed
  fireEvent.click(screen.getByRole('button', { name: /mark as fixed/i }));
  expect(screen.queryByText(/Active Fault/i)).not.toBeInTheDocument();
});

test('toggles machine list collapse state via mobile toggle button', () => {
  render(<App />);

  // Toggle button should be rendered
  const toggleBtn = screen.getByRole('button', { name: /toggle machine list/i });
  expect(toggleBtn).toBeInTheDocument();
  expect(toggleBtn).toHaveTextContent(/Hide ▲/i);

  // Click toggle button to collapse list
  fireEvent.click(toggleBtn);
  expect(toggleBtn).toHaveTextContent(/Show ▼/i);

  // Click toggle button again to expand list
  fireEvent.click(toggleBtn);
  expect(toggleBtn).toHaveTextContent(/Hide ▲/i);
});


