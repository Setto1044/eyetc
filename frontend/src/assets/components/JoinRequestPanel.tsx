type Props = {
  requests: string[];
  onAccept: (viewerId: string) => void;
  onReject: (viewerId: string) => void;
};

export default function JoinRequestPanel({
  requests,
  onAccept,
  onReject,
}: Props) {
  return (
    <div style={{ marginTop: "24px", width: "100%", maxWidth: "600px" }}>
      <h2>Join Requests</h2>

      {requests.length === 0 ? (
        <p>요청 없음</p>
      ) : (
        requests.map((viewerId) => (
          <div
            key={viewerId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#222",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
            }}
          >
            <span>{viewerId}</span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onAccept(viewerId)}>수락</button>
              <button onClick={() => onReject(viewerId)}>거절</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}