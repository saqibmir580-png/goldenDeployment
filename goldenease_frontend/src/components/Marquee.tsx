import React from 'react';

interface MarqueeProps {
  text?: string;
//   speed?: number;
  className?: string;
  bgColor?: string;
  textColor?: string;
  paddingY?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  text = "@maskan Pvt Ltd — Empowering Identity, Seamlessly",
  
  className = "",
  bgColor = "bg-black",
  textColor = "text-white ",
  paddingY = "py-1",
}) => {
  // Create multiple instances of the text for a seamless loop
//   const marqueeText = Array(5).fill(text).join(" • ");

  return (
    <div className={`w-full overflow-hidden ${bgColor} ${textColor} ${paddingY} ${className}`}>
      <div 
        className="whitespace-nowrap inline-block"
        style={{
          animation: `marquee linear infinite`,
          display: 'inline-block',
        }}
      >
        {text}
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
