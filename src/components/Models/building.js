import { useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ErrorBoundary from "../../ErrorBoundary";
import { Suspense, useEffect, useRef, useState } from "react";

export default function Scene(props) {
  const [geometry, setGeometry] = useState();
  var gltf = useLoader(GLTFLoader, "/models/GLTFModels/ApartmentBuilding.glb");
  if (!geometry) {
    const scene = gltf.scene.clone(true); // so we can instantiate multiple copies of this geometry
    setGeometry(scene);
  }

  const primitiveProps = {
    object: geometry,
    position: props.position,
  };

  const LoadingScreen = () => {
    return (
      <>
        <div>Loading Model</div>
      </>
    );
  };
  return (
    <Suspense fallback={LoadingScreen}>
      <primitive scale={[0.025, 0.025, 0.015]} {...primitiveProps} />
    </Suspense>
  );
}
