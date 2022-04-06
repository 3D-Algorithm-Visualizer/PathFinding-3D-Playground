import React, { useRef, useState } from "react";
export default function Box(props) {
  const mesh = useRef();

  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[6, 20, 6]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}
