export default function CursorReactiveLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="reactive-light" />
      <div className="panel-line panel-line-a" />
      <div className="panel-line panel-line-b" />
      <div className="panel-line panel-line-c" />
      <div className="signal-node signal-node-a" />
      <div className="signal-node signal-node-b" />
      <div className="signal-node signal-node-c" />
    </div>
  );
}
