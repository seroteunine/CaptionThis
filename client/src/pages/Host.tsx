function Host({ gameState }: { gameState: any }) {

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            {gameState}
            <button > Start game </button>
        </>
    )
}

export default Host
