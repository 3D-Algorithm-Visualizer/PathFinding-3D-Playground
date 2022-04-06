import React, { useState, useRef } from "react";
import Grid from "./Grid";
import { Canvas } from "react-three-fiber";
import Floor from "./Floor";
import Controls from "./Controls";
import { Select, MenuItem } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Tutorial from "./Tutorial";
import Settings from "./Settings";
import { AwesomeButton, AwesomeButtonProgress } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import "react-awesome-button/dist/styles.css";

//<OrbitControls enabled = {!worldSetup} />
function World(props) {
  let width = window.innerWidth;
  let height = window.innerHeigh;
  const GRID_SIZE = 20;

  const [selectedAlgorithm, setSelectedAlgorithm] = useState({}); // keeps track of the algorithm we choose
  const [runState, setRunState] = useState(false); //when runState is true the visualizer algorithm is running
  const [resetCamera, setResetCamera] = useState(false); //when resetCamera is true we reset the camera position
  const [clearWalls, setClearWalls] = useState(false);
  const [clearPath, setClearPath] = useState(false);
  const cameraPosition = useRef([0, 275, 0]);
  const [selectedMazeAlgorithm, setSelectedMazeAlgorithm] = useState("");
  const [algorithmSpeed, setAlgorithmSpeed] = useState("15");
  const [selected_algo_is_undefined, setAlgo] = useState(true);

  const [applyingSettings, setApplyingSettings] = useState(false);
  const [settingsConfig, setConfig] = useState({
    epochs: 350000,
    startRow: 5,
    startCol: 5,
    finishRow: 18,
    finishCol: 19,
    learningRate: 0.2,
    agentCuriosity: 0.8,
  });

  const [visualizeOptimalPolicy, setVisualizeOptimalPolicy] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        //margin: theme.spacing(1),
        background: "#25d366",
        border: 0,
        borderRadius: 3,
        color: "white",
        width: "150px",
        height: "44px",
        "margin-left": "10px",
        "font-family": "inherit",
        "font-weight": 600,
        "font-style": "normal",
      },
    },
  }));

  const classes = useStyles();

  //calling on this funciton in the child component (Grid) to update runstate in this parent
  function updateRunState(newState) {
    setRunState(newState);
  }
  function stopClearPath() {
    setClearPath(false);
  }
  function stopClearWalls() {
    setClearWalls(false);
  }

  function finishApplyingSettings() {
    setApplyingSettings(false);
  }

  function finishedOptimalPolicy() {
    setVisualizeOptimalPolicy(false);
  }
  function handleOnChange(event) {
    if (event.target.value !== undefined) {
      setAlgo(false);
    }
    if (event.target.value === undefined) {
      setAlgo(true);
    }
    if (event.target.value === "Dijkstra") {
      setSelectedAlgorithm({
        algorithm: "Dijkstra",
        type: "weighted",
        heuristic: "",
      });
    } else if (event.target.value === "aStar") {
      setSelectedAlgorithm({
        algorithm: "aStar",
        type: "weighted",
        heuristic: "poweredManhattanDistance",
      });
    } else if (event.target.value === "BFS") {
      setSelectedAlgorithm({
        algorithm: "BFS",
        type: "unweighted",
        heuristic: "",
      });
    } else if (event.target.value === "DFS") {
      setSelectedAlgorithm({
        algorithm: "DFS",
        type: "unweighted",
        heuristic: "",
      });
    }
  }
  function updateResetStatus() {
    setResetCamera(false);
  }
  function handleMazeChange(event) {
    setSelectedMazeAlgorithm(event.target.value);
  }
  function stopMazeSelection() {
    setSelectedMazeAlgorithm("");
  }

  return (
    <>
      <div className="header" align="center">
        <div className={classes.root}>
          <Select
            name="algorithms"
            id="algorithms"
            displayEmpty
            onChange={(e) => handleOnChange(e)}
          >
            <MenuItem>Select Algorithm</MenuItem>
            <MenuItem value="Dijkstra">Dijkstra's Algorithm</MenuItem>
            <MenuItem value="aStar">A* Search</MenuItem>
            <MenuItem value="BFS">Breadth First Search</MenuItem>
            <MenuItem value="DFS">Depth First Search</MenuItem>
          </Select>
        </div>
        <div className={classes.root}>
          <Select
            name="mazes"
            id="mazes"
            displayEmpty
            onChange={(e) => handleMazeChange(e)}
          >
            <MenuItem>Select Maze</MenuItem>
            <MenuItem value="randomMaze">Random Maze</MenuItem>
            <MenuItem value="recursiveDivision">Recursive Division</MenuItem>
          </Select>
        </div>
        <div id="visualize_btn" className="header_items">
          <AwesomeButtonProgress
            cssModule={AwesomeButtonStyles}
            type="whatsapp"
            size="medium"
            disabled={runState || selected_algo_is_undefined}
            loadingLabel="Visualizing..."
            resultLabel="Success"
            ripple={true}
            action={(element, next) => {
              setTimeout(() => {
                next(true, "");
                setRunState(true);
              }, 1000);
            }}
          >
            Visualize
          </AwesomeButtonProgress>
        </div>
        <div id="clearPath" className="header_items">
          <AwesomeButtonProgress
            cssModule={AwesomeButtonStyles}
            type="whatsapp"
            size="medium"
            disabled={runState}
            loadingLabel="Clearing Path..."
            resultLabel="Path Cleared :-)"
            ripple={true}
            action={(element, next) => {
              setTimeout(() => {
                next(true, "");
                setClearPath(true);
              }, 150);
            }}
          >
            Clear Path
          </AwesomeButtonProgress>
        </div>
        <div id="clearWalls" className="header_items">
          <AwesomeButtonProgress
            cssModule={AwesomeButtonStyles}
            type="whatsapp"
            size="medium"
            disabled={runState}
            loadingLabel="Clearing Walls..."
            resultLabel="Walls Cleared :-)"
            ripple={true}
            action={(element, next) => {
              setTimeout(() => {
                next(true, "");
                setClearWalls(true);
              }, 550);
            }}
          >
            Clear Walls
          </AwesomeButtonProgress>
        </div>
        <div className="header_items">
          <AwesomeButton
            cssModule={AwesomeButtonStyles}
            type="whatsapp"
            size="medium"
            ripple={true}
            action={(element, next) => {
              setResetCamera(!resetCamera);
            }}
          >
            Setup World
          </AwesomeButton>
        </div>
        <div className={classes.root}>
          <Select
            name="algorithmSpeed"
            id="algorithmSpeed"
            displayEmpty
            onChange={(e) => setAlgorithmSpeed(e.target.value)}
          >
            <MenuItem>Select Speed</MenuItem>
            <MenuItem value="15">Fast</MenuItem>
            <MenuItem value="25">Medium</MenuItem>
            <MenuItem value="80">Slow</MenuItem>
          </Select>
        </div>
      </div>
      {/* <Tutorial />
      <Settings /> */}
      <Canvas
        colorManagement
        camera={{
          position: cameraPosition.current,
          fov: 53,
          aspect: width / height,
          near: 1,
          far: 5000,
        }}
      >
        <ambientLight intensity={1} color={0xbbc2d0} />
        {/*<fog attach = "fog" args = {[0xFFFFFF , 0, 750]}/>*/}
        <hemisphereLight
          color={"hsl(0.6, 1, 0.6)"}
          groundColor={0x87775d}
          intensity={0.1}
          position={[0, 5, 0]}
        />
        <directionalLight
          color={"hsl(0.1, 1, 0.95)"}
          groundColor={0x87775d}
          intensity={0.5}
          position={[-70, 122.5, 70]}
          castShadow={true}
        />
        <Grid
          gridDimensions={GRID_SIZE}
          updateRunState={updateRunState}
          stopClearPath={stopClearPath}
          stopClearWalls={stopClearWalls}
          stopMazeSelection={stopMazeSelection}
          finishApplyingSettings={finishApplyingSettings}
          visualizeOptimalPolicy={visualizeOptimalPolicy}
          finishedOptimalPolicy={finishedOptimalPolicy}
          resetStatus={resetCamera}
          selectedAlgorithm={selectedAlgorithm}
          selectedMazeAlgorithm={selectedMazeAlgorithm}
          algorithmSpeed={algorithmSpeed}
          applyingSettings={applyingSettings}
          settingsConfig={settingsConfig}
          worldProperties={{
            rows: GRID_SIZE,
            cols: GRID_SIZE,
            runState: runState,
            clearPath: clearPath,
            clearWalls: clearWalls,
            start: {
              row: settingsConfig.startRow,
              col: settingsConfig.startCol,
            },
            finish: {
              row: settingsConfig.finishRow,
              col: settingsConfig.finishCol,
            },
            colors: {
              start: { r: 0.329, g: 0.27, b: 0.968 },
              finish: { r: 1, g: 0, b: 0 },
              wall: { r: 0, g: 0, b: 0 },
              visited: { r: 0, g: 1, b: 0 },
              path: { r: 0.823, g: 0.254, b: 0.776 },
              default: { r: 1, g: 1, b: 1 },
            },
            nodeDimensions: {
              height: 10,
              width: 10,
            },
          }}
        />
        <Floor />
        <Controls
          resetStatus={resetCamera}
          updateResetStatus={updateResetStatus}
        />
      </Canvas>
    </>
  );
}

export default World;
