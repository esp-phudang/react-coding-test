import { Ticket } from '@acme/shared-models';
import { Flex, message, Modal, Segmented, Spin } from 'antd';
import TicketCard from 'client/src/components/TicketCard/TicketCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './tickets.module.scss';

export interface TicketsProps {}

enum TicketStatus {
  ALL = 'All',
  COMPLETED = 'Completed',
  INPROGRESS = 'In progress',
}

const Tickets = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<TicketStatus>(
    TicketStatus.ALL
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newTicketDescription, setNewTicketDescription] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  //Prevent mutating original arr
  let arrangedTicketList = [...tickets].reverse();
  switch (filterStatus) {
    case TicketStatus.ALL:
      arrangedTicketList = arrangedTicketList;
      break;
    case TicketStatus.COMPLETED:
      arrangedTicketList = arrangedTicketList.filter((t) => t.completed);
      break;
    case TicketStatus.INPROGRESS:
      arrangedTicketList = arrangedTicketList.filter((t) => !t.completed);
      break;
  }

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');

      if (!res.ok) throw Error(res.statusText);

      const ticketList = await res.json();
      setTickets(ticketList);
    } catch (error) {
      message.error('Fetch ticket list failed!');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddTicket = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newTicketDescription,
        }),
      });

      if (!res.ok) throw Error(res.statusText);

      setOpenModal(false);
      setNewTicketDescription(undefined);
      fetchTickets();
      message.success('Create ticket successfully!');
    } catch (error) {
      message.error('Create ticket failed! Try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkTicketValidation = () => {
    if (newTicketDescription) {
      handleAddTicket();
    } else {
      message.error('Please fill the description!');
    }
  };

  if (isFetching) {
    return (
      <div className="flex-grow flex justify-center items-center gap-4">
        <Spin />
        Loading...
      </div>
    );
  }

  const onTicketClick = (ticketId: number) => navigate(`/tickets/${ticketId}`);

  return (
    <div className="w-full flex flex-col gap-4">
      <Segmented
        className="ml-auto"
        value={filterStatus}
        options={[
          TicketStatus.ALL,
          TicketStatus.COMPLETED,
          TicketStatus.INPROGRESS,
        ]}
        onChange={(e) => setFilterStatus(e)}
      />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={styles['add_card']} onClick={() => setOpenModal(true)}>
          + New
        </div>
        {arrangedTicketList.map((t) => (
          <TicketCard
            key={t.id}
            data={t}
            isPreview
            className="grid-span-1 md:grid-span-2 lg:grid-span-3"
            onClick={onTicketClick}
          />
        ))}
      </div>
      <Modal
        open={openModal}
        title="New ticket"
        onCancel={() => setOpenModal(false)}
        onOk={checkTicketValidation}
        destroyOnClose
        okButtonProps={{ loading: isSubmitting }}
      >
        <Flex vertical gap={'1rem'}>
          <Flex vertical>
            <label>Description</label>
            <textarea
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #d9d9d9',
                padding: '0.5rem',
                marginTop: 10,
              }}
              value={newTicketDescription}
              onChange={(e) => setNewTicketDescription(e.target.value)}
            />
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
};

export default Tickets;
