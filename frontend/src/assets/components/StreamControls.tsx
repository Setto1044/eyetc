interface Props {
  onStart: () => void;
  onStop: () => void;
}

export default function StreamControls({ onStart, onStop }: Props) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <button onClick={onStart}>카메라 시작</button>
      <button onClick={onStop}>카메라 종료</button>
    </div>
  );
}