function FocusTimer() {
  const [timeLeft, setTimeLeft] = React.useState(1500); // 25 minutes
  const [isRunning, setIsRunning] = React.useState(false);
  const [treeStage, setTreeStage] = React.useState(0); // 0: seed, 1: small tree, 2: grown tree
  const [forest, setForest] = React.useState([]);
  const [failMessage, setFailMessage] = React.useState('');
  const growthStages = ['🌱', '🌿', '🌳']; // Sapling growth stages

  React.useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            growTreeFully();  // Tree fully grown
            return 0;
          }
          // Grow the sapling every 750 seconds (every 30-45 seconds for simulation)
          if (prevTime % 750 === 0) {
            growTree();
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const growTree = () => {
    setTreeStage((prevStage) => Math.min(prevStage + 1, growthStages.length - 1));
  };

  const growTreeFully = () => {
    setIsRunning(false);
    setTreeStage(growthStages.length - 1); // Fully grown tree
    setForest((prevForest) => [...prevForest, '🌳']); // Add to forest
    resetTimer();
  };

  const resetTimer = () => {
    setTimeLeft(1500); // 25 minutes
    setTreeStage(0);    // Reset sapling
    setFailMessage('');
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      setTreeStage(0); // Tree dies
      setFailMessage('You lost your focus. Your tree disintegrated.');
    } else {
      setIsRunning(true);
      setFailMessage('');
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Focus Timer</h1>
      <div className="text-4xl">{formatTime()}</div>
      <button onClick={handleStartPause} className={`py-2 px-4 ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white`}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <div className="mt-4">
        {failMessage && <div className="text-red-500">{failMessage}</div>}
        <div className="tree">{growthStages[treeStage]}</div>
      </div>

      <button className="forest-button" onClick={() => alert(forest.length ? `Your Forest: ${forest.join(', ')}` : 'Your Forest is empty.')}>
        Your Forest
      </button>

      <div className="forest-container">
        <h2>Your Forest</h2>
        <div className="flex">
          {forest.map((tree, index) => (
            <div key={index} className="tree">{tree}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<FocusTimer />, document.getElementById('app'));
