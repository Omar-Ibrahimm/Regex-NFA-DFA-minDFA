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

const FSMVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { fsmType } = useParams<{ fsmType: string }>();
  const { FSMs } = useFSMContext();
  const fsm = FSMs.find((f) => f.type === fsmType?.toUpperCase());

  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Dragging logic
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
      const centerX = 500;
      const centerY = 300;
      const radius = 200;
      const angleStep = (2 * Math.PI) / fsm.states.length;

      const init: Record<string, { x: number; y: number }> = {};
      fsm.states.forEach((s: State, i: number) => {
        const angle = i * angleStep;
        init[s.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
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

    // Group transitions by from-to pair
    const transitionMap: Record<string, string[]> = {};
    for (const t of fsm.transitions) {
      const key = `${t.from}->${t.to}`;
      if (!transitionMap[key]) transitionMap[key] = [];
      transitionMap[key].push(t.symbol);
    }

    // Draw transitions
    Object.entries(transitionMap).forEach(([key, symbols]) => {
      const [from, to] = key.split("->");
      const fromPos = positions[from];
      const toPos = positions[to];
      if (!fromPos || !toPos) return;

      if (from === to) {
        const loopRadius = STATE_RADIUS * 4;
        const startAngle = Math.PI / 4; // 45 degrees
        const endAngle = (3 * Math.PI) / 4; // 135 degrees

        // Calculate start and end points
        const start = {
          x: fromPos.x + STATE_RADIUS * Math.cos(startAngle),
          y: fromPos.y + STATE_RADIUS * Math.sin(startAngle),
        };

        const end = {
          x: fromPos.x + STATE_RADIUS * Math.cos(endAngle),
          y: fromPos.y + STATE_RADIUS * Math.sin(endAngle),
        };

        // Calculate control points
        const cp1 = {
          x: fromPos.x + loopRadius * Math.cos(startAngle),
          y: fromPos.y + loopRadius * Math.sin(startAngle),
        };

        const cp2 = {
          x: fromPos.x + loopRadius * Math.cos(endAngle),
          y: fromPos.y + loopRadius * Math.sin(endAngle),
        };

        // Draw quadratic Bézier curve
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        ctx.strokeStyle = transitionColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calculate arrowhead position and angle
        const arrowAngle = Math.atan2(end.y - cp2.y, end.x - cp2.x);

        // Draw arrowhead
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

        // Position symbols at the top of the loop
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

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = transitionColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrowhead
        const headlen = 10;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headlen * Math.cos(angle - Math.PI / 6),
          endY - headlen * Math.sin(angle - Math.PI / 6),
        );
        ctx.lineTo(
          endX - headlen * Math.cos(angle + Math.PI / 6),
          endY - headlen * Math.sin(angle + Math.PI / 6),
        );
        ctx.closePath();
        ctx.fillStyle = textColor;
        ctx.fill();

        // Symbols
        ctx.fillStyle = textColor;
        ctx.font = "14px sans-serif";
        const formattedSymbols = symbols
          .map((sym) => (sym === "epsilon" ? "ε" : sym))
          .join(", ");
        ctx.fillText(
          formattedSymbols,
          (startX + endX) / 2 + 5,
          (startY + endY) / 2 - 5,
        );
      }
    });

    // Draw states
    for (const state of fsm.states) {
      const pos = positions[state.id];
      if (!pos) continue;

      // Circle
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

      // Label
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
    }, simulationDelay); // Use dynamic delay

    return () => clearTimeout(timer);
  }, [
    isSimulating,
    currentIndex,
    inputText,
    currentSimState,
    fsm,
    simulationDelay,
  ]);

  // Handle dragging
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

  if (!fsm)
    return <div className="text-center text-red-500 mt-10">FSM not found</div>;

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
            width={1000}
            height={600}
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
            {/* Input Section */}
            <div className="md:col-span-2">
              <label
                htmlFor="fsm-input"
                className="block text-sm font-medium text-text mb-2"
              >
                Input String:
              </label>
              <input
                id="fsm-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter input text to simulate"
                className="w-full p-3 rounded-md bg-primary border border-card-border text-text focus:outline-none focus:ring-2 focus:ring-btn"
              />
            </div>

            {/* Simulation Speed */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <div className="flex items-center">
                  <Speed className="mr-1" fontSize="small" />
                  Simulation Speed:
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

          {/* Status and Controls */}
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
                className={`flex items-center px-4 py-2 rounded-md ${
                  isSimulating || !inputText
                    ? "bg-muted text-text opacity-50 cursor-not-allowed"
                    : "bg-btn text-text hover:bg-btn-hover"
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
