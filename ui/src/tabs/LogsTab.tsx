
export function LogsTab() {
  // TODO: add a switch to control order of messages: chrono / reverse
  const messages = [
    {time: "2024-11-29 17:41:11", msg: "Hello"},
    {time: "2024-11-29 17:41:11", msg: "Hello"},
    {time: "2024-11-29 17:41:11", msg: "Hello"},
    {time: "2024-11-29 17:41:11", msg: "Hello"},
  ];
  const style = "height: 80vh; width: 100%; overflow: auto;";
  return (<pre style={style}>
      {messages.map(m =>
        <><strong>{m.time}</strong> {`${m.msg}\n`}</>
      )}
  </pre>);
}
