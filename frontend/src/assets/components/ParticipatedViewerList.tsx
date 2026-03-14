type Props = {
  viewers: string[];
};

export default function ParticipatedViewerList({ viewers }: Props) {
  return (
    <div style={{ marginTop: "24px", width: "100%", maxWidth: "600px" }}>
      <h2>Participated Viewers</h2>

      {viewers.length === 0 ? (
        <p>참여 중인 시청자가 없습니다.</p>
      ) : (
        viewers.map((viewerId) => (
          <div
            key={viewerId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#1e1e1e",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <span>{viewerId}</span>
            <span style={{ fontSize: "14px", color: "#6ee7b7" }}>
              참여중
            </span>
          </div>
        ))
      )}
    </div>
  );
}