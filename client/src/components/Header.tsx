import { useNavigate } from 'react-router-dom';

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row justify-between mb-4 items-center">
        <h1
          className="text-[3rem] font-semibold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Ticket app
        </h1>
      </div>
    </div>
  );
};

export default Header;
