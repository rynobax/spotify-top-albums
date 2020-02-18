import React from "react";

interface PlayIconProps {
  className?: string;
}

const PlayIcon: React.FC<PlayIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={"icon-play " + className || ""}
  >
    <circle cx="12" cy="12" r="10" className="primary" />
    <path
      className="secondary"
      d="M15.51 11.14a1 1 0 0 1 0 1.72l-5 3A1 1 0 0 1 9 15V9a1 1 0 0 1 1.51-.86l5 3z"
    />
  </svg>
);

export default PlayIcon;
