import React from 'react';
import { UserStats } from '../components/UserStats';

export const UserDashboard = () => {
  const user = sessionStorage.getItem('currentPlayer');

  interface UserStatsProps {
    userData: {
      label: string;
      stats: string;
      progress: number;
      color: string;
      icon: 'up' | 'down';
    }[];
  }

  const userData: UserStatsProps['userData'] = [
    {
      label: 'Games Played',
      stats: '10',
      progress: 100,
      color: 'blue',
      icon: 'up',
    },
    {
      label: 'Games Won',
      stats: '5',
      progress: 50,
      color: 'green',
      icon: 'up',
    },
    {
      label: 'Games Lost',
      stats: '5',
      progress: 50,
      color: 'red',
      icon: 'down',
    },
  ];

  return (
    <>
      <h1>Welcome back {user}, enjoy some nice stats</h1>
      <UserStats userData={userData} />
    </>
  );
};