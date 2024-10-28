import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TicketCard from './TicketCard';

import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { UserOptionsContext } from 'client/src/app/app';

const ticketMockData = {
  id: 1,
  assigneeId: 1,
  description: 'Hello world',
  completed: false,
};

describe('Testing Ticket card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <UserOptionsContext.Provider
        value={[
          { label: 'Jenifer', value: 1 },
          { label: 'Tomey', value: 2 },
        ]}
      >
        <TicketCard data={ticketMockData} />
      </UserOptionsContext.Provider>
    );
    expect(screen.getByText('Hello world')).toBeTruthy();
    expect(screen.getByText('Jenifer')).toBeTruthy();
  });

  it('check completing', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    render(<TicketCard data={ticketMockData} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(global.fetch).toBeCalledWith(`/api/tickets/1/complete`, {
      method: 'PUT',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it('check completing failed', async () => {
    global.fetch = jest.fn().mockRejectedValue({ ok: false });

    render(<TicketCard data={ticketMockData} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(global.fetch).toBeCalledWith(`/api/tickets/1/complete`, {
      method: 'PUT',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(checkbox).not.toBeChecked());
  });
});
