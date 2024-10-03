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

const WarningModal = ({ onContinue, onLeave }) => {
  return h('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
    h('div', { className: 'bg-white p-6 rounded-lg shadow-xl max-w-sm w-full' },
      [
        h('h2', { className: 'text-xl font-bold mb-4 text-red-600' }, 'Warning!'),
        h('p', { className: 'mb-6' }, 'The focus activity will fail and the tree will disintegrate if you leave this window.'),
        h('div', { className: 'flex justify-between' },
          [
            h('button', { 
              onClick: onContinue, 
              className: 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
            }, 'Continue'),
            h('button', { 
              onClick: onLeave, 
              className: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
            }, 'Leave')
          ]
        )
      ]
    )
  );
};

const ForestTimer = () => {
  const SESSION_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = React.useState(SESSION_TIME);
  const [isActive, setIsActive] = React.useState(false);
  const [trees, setTrees] = React.useState([]);
  const [isWithering, setIsWithering] = React.useState(false);
  const [showWitherMessage, setShowWitherMessage] = React.useState(false);
  const [showWarningModal, setShowWarningModal] = React.useState(false);

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
        setShowWarningModal(true);
      }
    };

    const handleFocusLoss = () => {
      if (isActive) {
        setShowWarningModal(true);
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

  const handleContinue = () => {
    setShowWarningModal(false);
    window.focus(); // Attempt to bring the window back into focus
  };

  const handleLeave = () => {
    setShowWarningModal(false);
    stopSession('You chose to leave. Your tree withered.');
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

  return h('div', { className: "min-h-screen bg-green-50 flex items-center justify-center p-4" },
    [
      h('div', { className: "w-[300px] border-green-200 bg-white shadow-lg rounded-lg p-6" },
        h('div', { className: "flex flex-col items-center space-y-4" }, [
          h('h1', { className: "text-2xl font-bold text-green-800 mb-2 text-center", key: 'title' }, "Focus Forest"),
          h('div', { className: "relative", key: 'tree' }, [
            h(GrowingTree, { key: 'growing-tree' }),
            showWitherMessage && h('div', {
              className: "absolute top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm animate-fade-in",
              key: 'wither-message'
            }, showWitherMessage)
          ]),
          h('div', { className: "text-5xl font-bold text-green-800 my-4", key: 'timer' }, formatTime(timeLeft)),
          h('div', { className: "flex flex-col w-full space-y-2", key: 'buttons' }, [
            h('button', {
              onClick: startSession,
              className: `w-full border-2 transition-colors p-2 rounded-md ${isActive 
                ? 'border-green-200 text-green-400' 
                : 'border-green-600 text-green-600 hover:bg-green-50'}`,
              disabled: isActive,
              key: 'start-button'
            }, "Start Session"),
            h('button', {
              onClick: () => stopSession(),
              className: `w-full border-2 transition-colors p-2 rounded-md ${!isActive 
                ? 'border-red-200 text-red-400' 
                : 'border-red-600 text-red-600 hover:bg-red-50'}`,
              disabled: !isActive,
              key: 'stop-button'
            }, "Stop Session")
          ]),
          h('button', {
            onClick: () => alert(`You have grown ${trees.length} trees!`),
            className: "w-full border-2 border-green-600 text-green-700 hover:bg-green-50 p-2 rounded-md",
            key: 'forest-button'
          }, [
            h(TreePine, { className: "inline-block mr-2 text-green-600", size: 24, key: 'forest-icon' }),
            `Your Forest (${trees.length} trees)`
          ])
        ])
      ),
      showWarningModal && h(WarningModal, { onContinue: handleContinue, onLeave: handleLeave })
    ]
  );
};

ReactDOM.render(React.createElement(ForestTimer), document.getElementById('root'));
