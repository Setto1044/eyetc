export default function ViewerPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h1>Viewer</h1>
      <p>스트리머 방송 시청 화면</p>

      <div
        style={{
          width: "800px",
          height: "450px",
          backgroundColor: "black",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}