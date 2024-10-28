import { User } from '@acme/shared-models';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { message } from 'antd';
import Header from '../components/Header';
import styles from './app.module.scss';
import TicketDetailPage from './pages/ticketDetail/ticketDetail';
import TicketListPage from './pages/tickets/tickets';
import { createContext, useContext } from 'react';

export const UserOptionsContext = createContext<
  { label: string; value: number }[]
>([]);

const App = () => {
  const [users, setUsers] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');

        if (!res.ok) throw Error(res.statusText);

        const userList: User[] = await res.json();
        setUsers(userList.map((u: User) => ({ label: u.name, value: u.id })));
      } catch (error) {
        message.error('Fetch user list failed!');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles['app']}>
      <Header />
      <UserOptionsContext.Provider value={users}>
        <Routes>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Routes>
      </UserOptionsContext.Provider>
    </div>
  );
};

export default App;
