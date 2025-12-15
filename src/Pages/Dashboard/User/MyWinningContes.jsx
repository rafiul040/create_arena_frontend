import React, { useEffect, useState } from 'react';

const MyWinningContes = () => {
  const [winningContests, setWinningContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data (replace this with your actual API call)
  useEffect(() => {
    async function fetchWinningContests() {
      // Replace the URL with your real endpoint
      try {
        setLoading(true);
        const res = await fetch('/api/my-winning-contests'); 
        const data = await res.json();
        setWinningContests(data);
      } catch (error) {
        console.error('Failed to fetch winning contests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinningContests();
  }, []);

  if (loading) return <p>Loading your winning contests...</p>;

  if (winningContests.length === 0)
    return <p>You have not won any contests yet. Keep trying!</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>My Winning Contests 🏆</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {winningContests.map(({ id, contestName, prize, dateWon }) => (
          <li
            key={id}
            style={{
              background: '#f9f9f9',
              marginBottom: 15,
              padding: 15,
              borderRadius: 8,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ fontSize: 18 }}>{contestName}</strong>
              <p style={{ margin: 4, color: '#555' }}>
                Prize: <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{prize}</span>
              </p>
              <small style={{ color: '#999' }}>Won on: {new Date(dateWon).toLocaleDateString()}</small>
            </div>
            <div style={{ fontSize: 24, color: '#ffb400' }}>🏅</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyWinningContes;
