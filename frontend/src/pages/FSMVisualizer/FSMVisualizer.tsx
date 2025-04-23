import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFSMContext } from "../../context/FSMContext";
import { State } from "../../types/FSM";
import FSMTextDisplay from "./FSMTextDisplay";
import {
  Download,
  PlayArrow,
  Replay,
  CheckCircle,
  Cancel,
  Speed,
} from "@mui/icons-material";

const STATE_RADIUS = 30;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const PADDING = 50;

const FSMVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { fsmType } = useParams<{ fsmType: string }>();
  const { FSMs } = useFSMContext();
  const fsm = FSMs.find((f) => f.type === fsmType?.toUpperCase());

  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const [draggingState, setDraggingState] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [inputText, setInputText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSimState, setCurrentSimState] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [simulationDelay, setSimulationDelay] = useState(1000);

  useEffect(() => {
    if (fsm) {
      const adjacency: Record<string, Set<string>> = {};
      fsm.states.forEach((s: State) => {
        adjacency[s.id] = new Set();
      });
      fsm.transitions.forEach((t) => {
        if (t.from !== t.to) {
          adjacency[t.from].add(t.to);
        }
      });

      const layers: string[][] = [];
      const visited: Set<string> = new Set();
      const queue: string[] = [fsm.startingState];
      visited.add(fsm.startingState);

      while (queue.length > 0) {
        const layerSize = queue.length;
        const currentLayer: string[] = [];

        for (let i = 0; i < layerSize; i++) {
          const state = queue.shift()!;
          currentLayer.push(state);

          adjacency[state].forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          });
        }

        layers.push(currentLayer);
      }

      fsm.states.forEach((s: State) => {
        if (!visited.has(s.id)) {
          layers.push([s.id]);
        }
      });

      const init: Record<string, { x: number; y: number }> = {};
      const layerWidth = 200;
      const stateSpacing = 150;

      let currentX = PADDING + STATE_RADIUS;
      let currentY = CANVAS_HEIGHT / 2;
      let direction = "right";
      const occupiedPositions: Set<string> = new Set();

      layers.forEach((layer) => {
        const layerHeight = (layer.length - 1) * stateSpacing;
        let startY = currentY - layerHeight / 2;

        const layerPositions: { state: string; x: number; y: number }[] = [];
        layer.forEach((state, stateIndex) => {
          let y = startY + stateIndex * stateSpacing;
          let x = currentX;

          let attempts = 0;
          const maxAttempts = 4;
          while (attempts < maxAttempts) {
            if (
              x + STATE_RADIUS > CANVAS_WIDTH - PADDING &&
              direction === "right"
            ) {
              direction = "down";
              currentX = x;
              currentY = y + stateSpacing;
              y = currentY;
              x = currentX;
            } else if (
              y + STATE_RADIUS > CANVAS_HEIGHT - PADDING &&
              direction === "down"
            ) {
              direction = "left";
              currentY = y;
              currentX = x - layerWidth;
              x = currentX;
              y = currentY;
            } else if (x - STATE_RADIUS < PADDING && direction === "left") {
              direction = "up";
              currentX = x;
              currentY = y - stateSpacing;
              y = currentY;
              x = currentX;
            } else if (y - STATE_RADIUS < PADDING && direction === "up") {
              direction = "right";
              currentY = y;
              currentX = x + layerWidth;
              x = currentX;
              y = currentY;
            }

            const posKey = `${Math.round(x)},${Math.round(y)}`;
            if (!occupiedPositions.has(posKey)) {
              occupiedPositions.add(posKey);
              break;
            }

            if (direction === "right") {
              x += layerWidth;
            } else if (direction === "down") {
              y += stateSpacing;
            } else if (direction === "left") {
              x -= layerWidth;
            } else if (direction === "up") {
              y -= stateSpacing;
            }

            attempts++;
          }

          x = Math.max(PADDING + STATE_RADIUS, Math.min(CANVAS_WIDTH - PADDING - STATE_RADIUS, x));
          y = Math.max(PADDING + STATE_RADIUS, Math.min(CANVAS_HEIGHT - PADDING - STATE_RADIUS, y));

          layerPositions.push({ state, x, y });
        });

        const lastPos = layerPositions[layerPositions.length - 1];
        currentX = lastPos.x;
        currentY = lastPos.y;

        if (direction === "right") {
          currentX += layerWidth;
        } else if (direction === "down") {
          currentY += stateSpacing;
        } else if (direction === "left") {
          currentX -= layerWidth;
        } else if (direction === "up") {
          currentY -= stateSpacing;
        }

        layerPositions.forEach(({ state, x, y }) => {
          init[state] = { x, y };
        });
      });

      setPositions(init);
    }
  }, [fsm]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fsm) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(canvas);
    const stateColor = styles.getPropertyValue("--color-state") || "#000";
    const startingColor =
      styles.getPropertyValue("--color-state-starting") || "#3b82f6";
    const terminatingColor =
      styles.getPropertyValue("--color-state-terminating") || "#10b981";
    const transitionColor =
      styles.getPropertyValue("--color-transition") || "#333";
    const textColor = styles.getPropertyValue("--color-text") || "#000";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Step 1: Group transitions by from-to pair and track bidirectional pairs
    const transitionMap: Record<string, { symbols: string[]; index: number; reverseIndex: number }> = {};
    const bidirectionalPairs: Set<string> = new Set();

    // First pass: Identify bidirectional pairs and count transitions
    for (const t of fsm.transitions) {
      const key = `${t.from}->${t.to}`;

      if (!transitionMap[key]) {
        transitionMap[key] = { symbols: [], index: 0, reverseIndex: 0 };
      }
      transitionMap[key].symbols.push(t.symbol);

      if (t.from !== t.to && fsm.transitions.some((rt) => rt.from === t.to && rt.to === t.from)) {
        const pair = [t.from, t.to].sort().join("->");
        bidirectionalPairs.add(pair);
      }
    }

    // Second pass: Assign indices for forward and reverse transitions
    Object.keys(transitionMap).forEach((key) => {
      const [from, to] = key.split("->");
      const pair = [from, to].sort().join("->");
      const reverseKey = `${to}->${from}`;

      if (bidirectionalPairs.has(pair)) {
        if (from < to) {
          // Forward direction (e.g., S0 -> S1)
          const forwardCount = transitionMap[key].symbols.length;
          const reverseCount = transitionMap[reverseKey] ? transitionMap[reverseKey].symbols.length : 0;
          transitionMap[key].index = 0; // Base index for forward
          transitionMap[key].reverseIndex = reverseCount; // Number of reverse transitions
          if (transitionMap[reverseKey]) {
            transitionMap[reverseKey].index = 1; // Base index for reverse
            transitionMap[reverseKey].reverseIndex = forwardCount; // Number of forward transitions
          }
        } else {
          // Reverse direction (e.g., S1 -> S0)
          const forwardCount = transitionMap[reverseKey] ? transitionMap[reverseKey].symbols.length : 0;
          const reverseCount = transitionMap[key].symbols.length;
          transitionMap[key].index = 1; // Base index for reverse
          transitionMap[key].reverseIndex = forwardCount; // Number of forward transitions
          if (transitionMap[reverseKey]) {
            transitionMap[reverseKey].index = 0; // Base index for forward
            transitionMap[reverseKey].reverseIndex = reverseCount; // Number of reverse transitions
          }
        }
      } else {
        // For non-bidirectional transitions, use index to alternate curves
        transitionMap[key].index = transitionMap[key].symbols.length - 1; // Increment index for each symbol
      }
    });

    // Step 2: Draw transitions with dynamic curvature
    Object.entries(transitionMap).forEach(([key, { symbols, index, reverseIndex }]) => {
      const [from, to] = key.split("->");
      const fromPos = positions[from];
      const toPos = positions[to];
      if (!fromPos || !toPos) return;

      if (from === to) {
        const loopRadius = STATE_RADIUS * 4;
        const startAngle = Math.PI / 4;
        const endAngle = (3 * Math.PI) / 4;

        const start = {
          x: fromPos.x + STATE_RADIUS * Math.cos(startAngle),
          y: fromPos.y + STATE_RADIUS * Math.sin(startAngle),
        };

        const end = {
          x: fromPos.x + STATE_RADIUS * Math.cos(endAngle),
          y: fromPos.y + STATE_RADIUS * Math.sin(endAngle),
        };

        const cp1 = {
          x: fromPos.x + loopRadius * Math.cos(startAngle),
          y: fromPos.y + loopRadius * Math.sin(startAngle),
        };

        const cp2 = {
          x: fromPos.x + loopRadius * Math.cos(endAngle),
          y: fromPos.y + loopRadius * Math.sin(endAngle),
        };

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        ctx.strokeStyle = transitionColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        const arrowAngle = Math.atan2(end.y - cp2.y, end.x - cp2.x);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - 10 * Math.cos(arrowAngle - Math.PI / 6),
          end.y - 10 * Math.sin(arrowAngle - Math.PI / 6),
        );
        ctx.lineTo(
          end.x - 10 * Math.cos(arrowAngle + Math.PI / 6),
          end.y - 10 * Math.sin(arrowAngle + Math.PI / 6),
        );
        ctx.closePath();
        ctx.fillStyle = textColor;
        ctx.fill();

        const textPos = {
          x: fromPos.x + loopRadius * Math.cos(Math.PI / 2),
          y: fromPos.y + loopRadius * 0.7,
        };

        ctx.fillStyle = textColor;
        ctx.font = "14px sans-serif";
        const formattedSymbols = symbols
          .map((sym) => (sym === "epsilon" ? "ε" : sym))
          .join(", ");
        ctx.fillText(formattedSymbols, textPos.x, textPos.y);
      } else {
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const angle = Math.atan2(dy, dx);

        const startX = fromPos.x + STATE_RADIUS * Math.cos(angle);
        const startY = fromPos.y + STATE_RADIUS * Math.sin(angle);
        const endX = toPos.x - STATE_RADIUS * Math.cos(angle);
        const endY = toPos.y - STATE_RADIUS * Math.sin(angle);

        // Calculate the curve offset
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const baseOffsetMagnitude = 40; // Base offset for the curve
        const offsetIncrement = 20; // Additional offset per reverse transition

        // Determine the direction of the curve (up or down)
        const isBidirectional = bidirectionalPairs.has([from, to].sort().join("->"));
        let offsetDirection: number;
        let offsetMagnitude: number;

        if (isBidirectional) {
          // For bidirectional transitions, use index to set base direction
          // and reverseIndex to adjust the magnitude
          offsetDirection = index === 0 ? 1 : -1; // Forward: up (1), Reverse: down (-1)
          // Increase the offset based on the number of transitions in the opposite direction
          offsetMagnitude = offsetDirection * baseOffsetMagnitude + reverseIndex * offsetIncrement;
        } else {
          // For non-bidirectional transitions, alternate the curve direction based on index
          offsetDirection = index % 2 === 0 ? 1 : -1;
          offsetMagnitude = baseOffsetMagnitude;
        }

        const offset = offsetMagnitude * offsetDirection;

        const controlX = midX + offset * Math.sin(angle);
        const controlY = midY - offset * Math.cos(angle);

        // Draw quadratic Bézier curve
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.strokeStyle = transitionColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead
        const headlen = 10;
        const arrowAngle = Math.atan2(endY - controlY, endX - controlX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(arrowAngle - Math.PI / 6),
          endY - headlen * Math.sin(arrowAngle - Math.PI / 6),
        );
        ctx.lineTo(
          endX - headlen * Math.cos(arrowAngle + Math.PI / 6),
          endY - headlen * Math.sin(arrowAngle + Math.PI / 6),
        );
        ctx.closePath();
        ctx.fillStyle = textColor;
        ctx.fill();

        // Symbols (positioned slightly offset from the curve)
        ctx.fillStyle = textColor;
        ctx.font = "14px sans-serif";
        const formattedSymbols = symbols
          .map((sym) => (sym === "epsilon" ? "ε" : sym))
          .join(", ");
        // Use the computed offset to position the text, with an additional small adjustment
        const textOffset = isBidirectional ? (offset + offsetDirection) : offset;
        const textX = midX + textOffset * Math.sin(angle);
        const textY = midY - textOffset * Math.cos(angle);
        ctx.fillText(formattedSymbols, textX, textY);
      }
    });

    // Draw states
    for (const state of fsm.states) {
      const pos = positions[state.id];
      if (!pos) continue;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, STATE_RADIUS, 0, 2 * Math.PI);
      const isSimSelected =
        currentSimState === state.id && fsm.type === "MIN_DFA";
      ctx.strokeStyle = isSimSelected
        ? "brown"
        : state.id === fsm.startingState
          ? startingColor
          : state.isTerminating
            ? terminatingColor
            : stateColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (state.isTerminating) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, STATE_RADIUS - 5, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(state.id, pos.x, pos.y);
    }
  }, [fsm, positions, currentSimState]);

  useEffect(() => {
    if (!isSimulating || !fsm || fsm.type !== "MIN_DFA") return;

    if (currentIndex >= inputText.length) {
      setIsSimulating(false);
      const currentState = fsm.states.find((s) => s.id === currentSimState);
      setStatus(currentState?.isTerminating ? "Matched!" : "Failed!");
      return;
    }

    const timer = setTimeout(() => {
      const symbol = inputText[currentIndex];
      const transition = fsm.transitions.find(
        (t) => t.from === currentSimState && t.symbol === symbol,
      );

      if (transition) {
        setCurrentSimState(transition.to);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsSimulating(false);
        setStatus("Failed!");
      }
    }, simulationDelay);

    return () => clearTimeout(timer);
  }, [
    isSimulating,
    currentIndex,
    inputText,
    currentSimState,
    fsm,
    simulationDelay,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || !fsm) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const state of fsm.states) {
      const pos = positions[state.id];
      if (!pos) continue;
      const dist = Math.hypot(x - pos.x, y - pos.y);
      if (dist < STATE_RADIUS) {
        setDraggingState(state.id);
        setOffset({ x: x - pos.x, y: y - pos.y });
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingState || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    setPositions((prev) => ({
      ...prev,
      [draggingState]: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setDraggingState(null);
  };

  const handleExportPNG = () => {
    handleReset();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fsm?.type || "fsm"}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentSimState(null);
    setCurrentIndex(0);
    setStatus(null);
  };

  const handleStartSimulation = () => {
    if (!fsm?.startingState || inputText.length === 0) return;
    setStatus(null);
    if (!currentSimState) {
      setCurrentSimState(fsm?.startingState);
      setCurrentIndex(0);
    }
    setIsSimulating(true);
  };

  const getStatusIcon = () => {
    if (!status) return null;
    if (status.includes("Matched")) {
      return <CheckCircle className="text-green-500 mr-1" />;
    }
    return <Cancel className="text-red-500 mr-1" />;
  };


  if (!fsm) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
        <svg
          className="w-32 h-32 text-gray-400 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-5xl font-extrabold text-gray-400 mb-4 tracking-wider">
          Oops! FSM Not Found.
        </h1>
        <p className="text-xl text-gray-400 text-center mb-6 max-w-md">
          Looks like your Finite State Machine (FSM) hasn't been generated yet. 
          It's probably lost in the void—let's get you back to safety!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-btn hover:bg-btn-hover text-text rounded-lg transition text-lg font-semibold"
        >
          Back to Homepage
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-10">
      <div className="flex justify-center gap-4">
        <div className="relative">
          <button
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
            onClick={handleExportPNG}
            title="Export as PNG"
          >
            <Download className="text-btn hover:text-btn-hover" />
          </button>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-card-border bg-card rounded shadow-lg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>

        <FSMTextDisplay fsm={fsm} selectedState={draggingState} />
      </div>

      {fsm.type === "MIN_DFA" && (
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-text">
            Text Match Simulation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="fsm-input"
                className="block text-sm font-medium text-text mb-2"
              >
                Input String
              </label>
              <input
                id="fsm-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter input text to simulate"
                className="w-full p-3 rounded-md bg-primary border border-card-border text-text focus:outline-none focus:ring-2 focus:ring-btn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <div className="flex items-center">
                  <Speed className="mr-1" fontSize="small" />
                  Simulation Speed
                </div>
              </label>
              <div className="flex items-center">
                <span className="text-text text-sm mr-2">Fast</span>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={simulationDelay}
                  onChange={(e) => setSimulationDelay(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-text text-sm ml-2">Slow</span>
              </div>
              <div className="text-right text-text text-sm mt-1">
                {simulationDelay}ms
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              {status && (
                <div
                  className={`flex items-center px-4 py-2 rounded-full ${
                    status.includes("Matched")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getStatusIcon()}
                  <span className="font-medium">{status}</span>
                </div>
              )}

              <div className="bg-muted rounded-md px-3 py-1">
                <span className="text-text text-sm mr-2">Position:</span>
                <span className="text-text font-mono font-bold">
                  {currentIndex}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating || !inputText}
                className={`flex items-center px-4 py-2 rounded-md bg-muted ${
                  isSimulating || !inputText
                    ? "text-text opacity-50 cursor-not-allowed"
                    : "text-text hover:bg-card-border"
                }`}
              >
                <PlayArrow className="mr-1" />
                Start Simulation
              </button>

              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-muted text-text rounded-md hover:bg-card-border"
              >
                <Replay className="mr-1" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FSMVisualizer;
