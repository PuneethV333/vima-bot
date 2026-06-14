const App = () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // 2. start recording
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();

  // 3. stop + get blob
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    // send to backend ↓
  };

  return <div></div>;
};

export default App;
