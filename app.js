const Tree = ({ progress, isWithering }) => {
    const baseSize = 48;
    const maxSize = 120;
    const currentSize = baseSize + (progress / 100) * (maxSize - baseSize);
    
    const treeColor = isWithering ? '#EF4444' : '#15803D';
    const treeStyle = {
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'all 0.5s',
        zIndex: 10,
    };
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={currentSize} height={currentSize} viewBox="0 0 24 24" 
             className={isWithering ? 'animate-withering' : 'animate-grow'}
             style={treeStyle}>
            <rect x="11" y="19" width="2" height="3" fill="#5B3E31"/>
            {/* Tree design based on growth */}
            <path d="M12,2L8,9L16,9Z" stroke={treeColor} fill={treeColor} strokeWidth="0.5"/>
            <path d="M12,6L7,14L17,14Z" stroke={treeColor} fill={treeColor} strokeWidth="0.5"/>
            <path d="M12,10L6,19L18,19Z" stroke={treeColor} fill={treeColor} strokeWidth="0.5"/>
        </svg>
    );
};

const ForestTimer = () => {
    const [timeLeft, setTimeLeft] = React.useState(25 * 60);
    const [isActive, setIsActive] = React.useState(false);
    const [trees, setTrees] = React.useState([]);
    const [isWithering, setIsWithering] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const SESSION_TIME = 25 * 60;
    const growthProgress = ((SESSION_TIME - timeLeft) / SESSION_TIME) * 100;

    React.useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            const newTree = { id: Date.now(), plantedAt: new Date().toISOString() };
            setTrees([...trees, newTree]);
            setTimeLeft(SESSION_TIME); // Reset timer for new session
            alert('Your tree has grown fully!');
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    return (
        <div className="natural-background">
            <div className="sky"></div>
            <div className="grass"></div>
            <div className="content-container">
                <div className="bg-box">
                    <h1 className="text-3xl font-bold text-green-800 mb-6">Focus Forest</h1>
                    
                    <div className="tree-container mb-6">
                        <div className="ground"></div>
                        <Tree progress={growthProgress} isWithering={isWithering} />
                    </div>
                    
                    <div className="timer-text">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>

                    <button 
                        onClick={() => setIsActive(true)} 
                        className="start-btn"
                        disabled={isActive}
                    >
                        Start Focus Session
                    </button>

                    <button 
                        onClick={() => setIsDialogOpen(true)} 
                        className="forest-btn"
                    >
                        Your Forest ({trees.length} trees)
                    </button>
                </div>
            </div>

            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} trees={trees} />
        </div>
    );
};

const Dialog = ({ isOpen, onClose, trees }) => {
    if (!isOpen) return null;
    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <button onClick={onClose} className="text-red-500 text-2xl">&times;</button>
                {trees.length === 0 ? (
                    <p>Your forest is empty. Complete a focus session to grow your first tree!</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {trees.map(tree => (
                            <div key={tree.id}>
                                <Tree progress={100} />
                                <span>{new Date(tree.plantedAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

ReactDOM.render(<ForestTimer />, document.getElementById('root'));
