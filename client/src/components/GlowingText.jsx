const GlowingText = (props) => {
  return (
    <div className="flex font-edunline group">
      {/* Glow */}
      <span className="absolute mx-auto py-2 flex w-fit blur-sm group-hover:bg-gradient-to-t from-[#ff9900] to-[#ff00ff] bg-clip-text text-4xl box-content text-transparent text-center select-none">
        {props.children}
      </span>
      {/* Text */}
      <h1 className="relative top-0 w-fit h-auto py-2 justify-center flex bg-gradient-to-t from-[#ff9900] to-[#ff00ff] items-center bg-clip-text text-4xl text-transparent text-center select-auto">
        {props.children}
      </h1>
    </div>
  )
}

export default GlowingText