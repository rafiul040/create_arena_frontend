import React, { useEffect, useState } from 'react';

const MyContestParticipate = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's participated contests from backend
  useEffect(() => {
    async function fetchParticipatedContests() {
      try {
        setLoading(true);
        // Replace with your actual API URL and include auth if needed
        const res = await fetch('/api/my-participated-contests');
        const data = await res.json();

        // Sort by upcoming deadline (soonest first)
        const sorted = data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        setContests(sorted);
      } catch (error) {
        console.error('Failed to fetch participated contests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParticipatedContests();
  }, []);

  if (loading) return <p>Loading your participated contests...</p>;

  if (contests.length === 0) return <p>You have not participated in any contests yet.</p>;

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>My Participated Contests</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contests.map(({ id, contestName, deadline, paymentStatus }) => (
          <li
            key={id}
            style={{
              background: '#f0f0f5',
              marginBottom: 15,
              padding: 15,
              borderRadius: 8,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div>
              <strong style={{ fontSize: 18 }}>{contestName}</strong>
              <p style={{ margin: 4, color: '#555' }}>
                Deadline: {new Date(deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  backgroundColor: paymentStatus === 'paid' ? '#4caf50' : '#f44336',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {paymentStatus}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyContestParticipate;
