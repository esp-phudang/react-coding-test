import { Ticket } from '@acme/shared-models';
import { message, Spin } from 'antd';
import TicketCard from 'client/src/components/TicketCard/TicketCard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface TicketDetailPageProps {}

const TicketDetailPage = (props: TicketDetailPageProps) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    id && fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`);

      if (!res.ok) throw Error(res.statusText);

      const ticket = await res.json();
      ticket.id && setTicket(ticket);
    } catch (error) {
      message.error('Fetch ticket detail failed!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin className="m-auto" />;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return <TicketCard data={ticket} />;
};

export default TicketDetailPage;
