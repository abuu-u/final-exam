const Loading = () => {
  return (
    <div className="fixed z-50 grid place-items-center w-[100vw] h-[100vh] bg-gray-700/80 left-0 top-0 text-[0px] leading-[0px]">
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loading
