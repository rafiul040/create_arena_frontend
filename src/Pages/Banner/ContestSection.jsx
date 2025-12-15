import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContestSection = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dummy auth check (replace with your auth logic)
  const isLoggedIn = Boolean(localStorage.getItem("authToken")); // Or from context/provider

  useEffect(() => {
    async function fetchPopularContests() {
      try {
        setLoading(true);
        // Replace with your API endpoint that returns contests with participation counts
        const res = await fetch("/api/popular-contests"); 
        const data = await res.json();

        // Sort by participationCount descending and limit to 5
        const sorted = data
          .sort((a, b) => b.participantsCount - a.participantsCount)
          .slice(0, 5);

        setContests(sorted);
      } catch (error) {
        console.error("Failed to fetch popular contests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularContests();
  }, []);

  if (loading) return <p>Loading popular contests...</p>;

  if (contests.length === 0) return <p>No popular contests available.</p>;

  return (
    <section style={{ padding: "20px", maxWidth: 960, margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Popular Contests</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 20,
        }}
      >
        {contests.map(
          ({
            id,
            contestName,
            participantsCount,
            description,
            imageURL,
          }) => (
            <div
              key={id}
              style={{
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 160,
                  background: `url(${imageURL || "https://via.placeholder.com/400x160?text=No+Image"}) center/cover no-repeat`,
                }}
                aria-label={`Image for ${contestName}`}
              />
              <div style={{ padding: 16, flexGrow: 1 }}>
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#222",
                  }}
                >
                  {contestName}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#555",
                    marginBottom: 12,
                    minHeight: 48,
                  }}
                  title={description}
                >
                  {description.length > 80
                    ? description.slice(0, 80) + "…"
                    : description}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#0070f3",
                    marginBottom: 12,
                  }}
                >
                  Participants: {participantsCount}
                </p>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/contests/${id}`);
                    } else {
                      navigate("/login");
                    }
                  }}
                  style={{
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: 6,
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: "600",
                  }}
                  aria-label={`View details for ${contestName}`}
                >
                  Details
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={() => navigate("/all_contests")}
          style={{
            backgroundColor: "#555",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "600",
          }}
          aria-label="Show all contests"
        >
          Show All
        </button>
      </div>
    </section>
  );
};

export default ContestSection;
