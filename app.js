function FocusTimer() {
  const [timeLeft, setTimeLeft] = React.useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = React.useState(false);
  const [treeState, setTreeState] = React.useState('seed'); // 'seed', 'grown', 'dead'
  const [forest, setForest] = React.useState([]);
  const [windowFocused, setWindowFocused] = React.useState(true);
  const [failMessage, setFailMessage] = React.useState(''); // New state for failure message

  React.useEffect(() => {
    let timer = null;
    
    if (isRunning && windowFocused) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            growTree();  // Trigger tree growth on completion
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, windowFocused]);

  const growTree = () => {
    setIsRunning(false);
    setTreeState('grown');
    setTimeout(() => {
      setForest([...forest, '🌳']);
      resetTimer();
    }, 2000);  // Wait for 2 seconds before resetting
  };

  const resetTimer = () => {
    setTimeLeft(1500); // Reset to 25 minutes
    setTreeState('seed');
    setFailMessage('');  // Clear the fail message on reset
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      setTreeState('dead');
      setFailMessage('You lost your focus. Your tree disintegrated.'); // Show fail message
    } else {
      setIsRunning(true);
      setTreeState('seed');
      setFailMessage('');  // Clear fail message when restarting the timer
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle tab visibility changes
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setWindowFocused(!document.hidden);
      if (document.hidden && isRunning) {
        setTreeState('dead');
        setFailMessage('You lost your focus. Your tree disintegrated.'); // Show fail message
        setIsRunning(false);
        resetTimer(); // Reset the timer when focus is lost
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Focus Timer</h1>
      <div className="text-4xl mb-6">{formatTime()}</div>
      <button 
        onClick={handleStartPause} 
        className={`py-2 px-4 rounded ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>

      {/* Fail message display */}
      {failMessage && <div className="mt-4 text-red-500 font-bold">{failMessage}</div>}

      <div className="mt-6">
        {treeState === 'seed' && <div className="tree">🌱</div>}
        {treeState === 'grown' && <div className="tree grown-tree">🌳</div>}
        {treeState === 'dead' && <div className="tree dead-tree">🥀</div>}
      </div>

      {/* Displaying the forest of grown trees */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Your Forest</h2>
        <div className="flex space-x-2">
          {forest.map((tree, index) => (
            <div key={index} className="tree">{tree}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<FocusTimer />, document.getElementById('app'));
