import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Tickets from './tickets';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Wrapper = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Tickets />} />
    </Routes>
  </BrowserRouter>
);

describe('Tickets', () => {
  it('should show add new modal', async () => {
    render(<Wrapper />);
    const newButton = screen.getByText('+ New');
    fireEvent.click(newButton);
    expect(screen.getByText('New ticket')).toBeTruthy();
  });

  it('should prevent to add new ticket without description modal', () => {
    render(<Wrapper />);
    const newButton = screen.getByText('+ New');
    fireEvent.click(newButton);
    expect(screen.getByText('New ticket')).toBeTruthy();
    const addButton = screen.getByText('OK');
    fireEvent.click(addButton);
    expect(screen.getByText('Please fill the description!')).toBeTruthy();
  });

  it('should render successfully', async () => {
    const ticketList = [
      {
        id: 1,
        assigneeId: null,
        description: 'Test 1',
        completed: false,
      },
    ];
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(ticketList),
      } as Response)
    );
    render(<Wrapper />);

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeTruthy();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  it('should filter tickets by status', async () => {
    const ticketList = [
      {
        id: 1,
        assigneeId: null,
        description: 'Test 1',
        completed: false,
      },
      {
        id: 2,
        assigneeId: null,
        description: 'Test 2',
        completed: true,
      },
      {
        id: 3,
        assigneeId: null,
        description: 'Test 3',
        completed: false,
      },
    ];
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(ticketList),
      } as Response)
    );
    render(<Wrapper />);
    await waitFor(() => {
      const completedButton = screen.getByText('Completed');
      fireEvent.click(completedButton);
    });

    let allCheckboxes = screen.getAllByRole('checkbox');
    expect(allCheckboxes).toHaveLength(1);

    const inProgressButton = screen.getByText('In progress');
    fireEvent.click(inProgressButton);
    allCheckboxes = screen.getAllByRole('checkbox');
    expect(allCheckboxes).toHaveLength(2);
  });
});
