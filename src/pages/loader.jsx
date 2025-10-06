import React from 'react';

//Spinner for buttons (para di plain)
const Loader = () => {
  return (
    <div className="relative w-6 h-6 rounded-md">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={`bar${index + 1}`}
          className="absolute w-[8%] h-[24%] bg-gray-200 left-1/2 top-[30%] opacity-0 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.2)] animate-[fade458_1s_linear_infinite]"
          style={{
            transform: `rotate(${index * 30}deg) translate(0, -130%)`,
            animationDelay: `-${1.1 - index * 0.1}s`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes fade458 {
            from { opacity: 1; }
            to { opacity: 0.25; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;