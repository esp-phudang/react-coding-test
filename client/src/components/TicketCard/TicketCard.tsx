import { Ticket } from '@acme/shared-models';
import { Checkbox, Flex, message, Select } from 'antd';
import { UserOptionsContext } from 'client/src/app/app';
import { useContext, useState } from 'react';
import styles from './TicketCard.module.scss';

export interface TicketProps {
  data: Ticket;
  className?: string;
  isPreview?: boolean;
  onClick?: (ticketId: number) => void;
}

const TicketCard = (props: TicketProps) => {
  const { data, isPreview, onClick } = props;
  const [ticket, setTicket] = useState<Ticket>(data);
  const userOptions = useContext(UserOptionsContext);

  const changeAssignee = async (assigneeId: number) => {
    if (assigneeId == undefined) return;
    setTicket({ ...ticket, assigneeId: assigneeId });

    try {
      const res = await fetch(
        `/api/tickets/${ticket.id}/assign/${assigneeId}`,
        {
          method: 'PUT',
          body: JSON.stringify({}),
        }
      );

      if (!res.ok) throw Error(res.statusText);

      message.success('Update assignee successfully!');
    } catch (error) {
      setTicket({ ...ticket, assigneeId: data.assigneeId });
      message.error('Update assignee failed!');
    } finally {
    }
  };

  const changeStatus = async (completed: boolean) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/complete`, {
        method: completed ? 'PUT' : 'DELETE',
      });

      if (!res.ok) throw Error(res.statusText);

      message.success(completed ? 'Complete ticket!' : 'Uncompleted ticket!');
      setTicket({ ...ticket, completed: completed });
    } catch (error) {
      setTicket({ ...ticket, completed: data.completed });
      message.error('Update ticket failed!');
    }
  };

  const unAssign = async () => {
    setTicket({ ...ticket, assigneeId: null });
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/unassign`, {
        method: 'PUT',
        body: JSON.stringify({}),
      });

      if (!res.ok) throw Error(res.statusText);

      message.success('Remove assignee successfully!');
    } catch (error) {
      setTicket({ ...ticket, assigneeId: data.assigneeId });
      message.error('Remove assignee failed!');
    } finally {
    }
  };

  return (
    <div className={styles['ticket']} onClick={() => onClick?.(ticket.id)}>
      <div className={styles['header']}>
        <Flex gap={4} align="center">
          {ticket.id}.
          <Select
            size="large"
            defaultValue={ticket.assigneeId}
            options={userOptions}
            value={ticket.assigneeId}
            onChange={changeAssignee}
            className="w-[100px]"
            onClick={(e) => e.stopPropagation()}
            onClear={unAssign}
            allowClear
          />
        </Flex>
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            data-testid={`checkbox-${ticket.id}`}
            checked={ticket.completed}
            onChange={(e) => changeStatus(e.target.checked)}
          />
        </div>
      </div>
      <div className={!isPreview ? styles['description'] : styles['preview']}>
        {ticket.description}
      </div>
    </div>
  );
};

export default TicketCard;
