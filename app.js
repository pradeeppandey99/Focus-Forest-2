const { useState, useEffect, createElement: h } = React;

const Sprout = ({ className, size, style }) => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className,
  style: style
}, [
  h('path', { d: "M7 20h10", key: 1 }),
  h('path', { d: "M12 20v-9", key: 2 }),
  h('path', { d: "M9 3.6c-1.2.6-2 2-2 3.4 0 2.2 1.8 4 4 4", key: 3 }),
  h('path', { d: "M15 3.6c1.2.6 2 2 2 3.4 0 2.2-1.8 4-4 4", key: 4 })
]);

const TreePine = ({ className, size, style }) => h('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className,
  style: style
}, [
  h('path', { d: "m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z", key: 1 }),
  h('path', { d: "M12 22v-3", key: 2 })
]);

const ForestTimer = () => {
  const SESSION_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = React.useState(SESSION_TIME);
  const [isActive, setIsActive] = React.useState(false);
  const [trees, setTrees] = React.useState([]);
  const [isWithering, setIsWithering] = React.useState(false);
  const [showWitherMessage, setShowWitherMessage] = React.useState(false);

  const growthProgress = ((SESSION_TIME - timeLeft) / SESSION_TIME) * 100;

  React.useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setTrees(prevTrees => [...prevTrees, {
        id: prevTrees.length + 1,
        plantedAt: new Date(),
        isNew: true
      }]);
      setTimeLeft(SESSION_TIME);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden) {
        stopSession('You switched tabs. Your tree withered.');
      }
    };

    const handleFocusLoss = () => {
      if (isActive) {
        stopSession('You lost focus. Your tree withered.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleFocusLoss);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleFocusLoss);
    };
  }, [isActive]);

  const startSession = () => {
    setIsActive(true);
    setIsWithering(false);
    setShowWitherMessage(false);
  };

  const stopSession = (message = 'You lost focus. Your tree withered.') => {
    setIsActive(false);
    setIsWithering(true);
    setShowWitherMessage(message);
    
    setTimeout(() => {
      setTimeLeft(SESSION_TIME);
      setIsWithering(false);
      setTimeout(() => setShowWitherMessage(false), 2000);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const GrowingTree = () => {
    const baseSize = 24;
    const growthSize = Math.min(48, baseSize + (growthProgress / 100) * 24);

    return React.createElement('div', { className: "relative h-16 flex items-center justify-center" },
      React.createElement('div', { className: `transition-all duration-500 ${isWithering ? 'animate-withering' : ''}` },
        growthProgress < 50 ?
          React.createElement(Sprout, {
            className: `transition-all duration-500 ${isWithering ? 'text-red-400' : 'text-green-600'}`,
            size: growthSize,
            style: {
              transform: `scale(${1 + growthProgress/200})`
            }
          }) :
          React.createElement(TreePine, {
            className: `transition-all duration-500 ${isWithering ? 'text-red-400' : 'text-green-600'}`,
            size: growthSize,
            style: {
              transform: `scale(${1 + (growthProgress-50)/200})`
            }
          })
      )
    );
  };

  return React.createElement('div', { className: "min-h-screen bg-green-50 flex items-center justify-center p-4" },
    React.createElement('div', { className: "w-[300px] border-green-200 bg-white shadow-lg rounded-lg p-6" },
      React.createElement('div', { className: "flex flex-col items-center space-y-4" }, [
        React.createElement('h1', { className: "text-2xl font-bold text-green-800 mb-2 text-center", key: 'title' }, "Focus Forest"),
        React.createElement('div', { className: "relative", key: 'tree' }, [
          React.createElement(GrowingTree, { key: 'growing-tree' }),
          showWitherMessage && React.createElement('div', {
            className: "absolute top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm animate-fade-in",
            key: 'wither-message'
          }, showWitherMessage)
        ]),
        React.createElement('div', { className: "text-5xl font-bold text-green-800 my-4", key: 'timer' }, formatTime(timeLeft)),
        React.createElement('div', { className: "flex flex-col w-full space-y-2", key: 'buttons' }, [
          React.createElement('button', {
            onClick: startSession,
            className: `w-full border-2 transition-colors p-2 rounded-md ${isActive 
              ? 'border-green-200 text-green-400' 
              : 'border-green-600 text-green-600 hover:bg-green-50'}`,
            disabled: isActive,
            key: 'start-button'
          }, "Start Session"),
          React.createElement('button', {
            onClick: () => stopSession(),
            className: `w-full border-2 transition-colors p-2 rounded-md ${!isActive 
              ? 'border-red-200 text-red-400' 
              : 'border-red-600 text-red-600 hover:bg-red-50'}`,
            disabled: !isActive,
            key: 'stop-button'
          }, "Stop Session")
        ]),
        React.createElement('button', {
          onClick: () => alert(`You have grown ${trees.length} trees!`),
          className: "w-full border-2 border-green-600 text-green-700 hover:bg-green-50 p-2 rounded-md",
          key: 'forest-button'
        }, [
          React.createElement(TreePine, { className: "inline-block mr-2 text-green-600", size: 24, key: 'forest-icon' }),
          `Your Forest (${trees.length} trees)`
        ])
      ])
    )
  );
};

ReactDOM.render(React.createElement(ForestTimer), document.getElementById('root'));