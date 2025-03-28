import ThemeSwitch from "./ThemeSwitch"

const NavBar = () => {
    return (
        <nav className="w-full border-b border-border bg-secondary">
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-extrabold text-txt hover:text-accent transition-colors tracking-wide drop-shadow-lg">
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                                Regex → NFA → DFA → minDFA
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center h-full">
                        <button className="px-3 py-2 h-full text-primary transition-all duration-300 hover:bg-button mr-1" >
                            Go Back
                        </button>
                        <ThemeSwitch />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar