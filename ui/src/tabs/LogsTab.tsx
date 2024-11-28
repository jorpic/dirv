
export function LogsTab() {
  // TODO: add a switch to control order of messages: chrono / reverse
  const messages = [
    {time: "1231234123", msg: "Hello"},
    {time: "12341234",  msg: "Hello"},
    {time: "1341231", msg: "Hello"},
    {time: "234234523", msg: "Hello"},
  ];
  const style = "height: 80vh; width: 100%; overflow: auto;";
  return (<pre style={style}>
      {messages.map(m =>
        <><strong>{m.time}</strong> {`${m.msg}\n`}</>
      )}
  </pre>);
}
