import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFSMContext } from "../../context/FSMContext";
import { State } from "../../types/FSM";

const STATE_RADIUS = 30;

const FSMVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { fsmType } = useParams<{ fsmType: string }>();
  const { FSMs } = useFSMContext();
  const fsm = FSMs.find(f => f.type === fsmType?.toUpperCase());

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Dragging logic
  const [draggingState, setDraggingState] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
    const terminatingColor = styles.getPropertyValue("--color-state-terminating") || "#10b981";
    const transitionColor = styles.getPropertyValue("--color-transition") || "#333";
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
      ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = textColor;
      ctx.fill();

      // Symbols
      ctx.fillStyle = textColor;
      ctx.font = "14px sans-serif";
      ctx.fillText(symbols.join(", "), (startX + endX) / 2 + 5, (startY + endY) / 2 - 5);
    });

    // Draw states
    for (const state of fsm.states) {
      const pos = positions[state.id];
      if (!pos) continue;

      // Circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, STATE_RADIUS, 0, 2 * Math.PI);
      ctx.strokeStyle = state.isTerminating ? terminatingColor : stateColor;
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
  }, [fsm, positions]);

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
    setPositions(prev => ({
      ...prev,
      [draggingState]: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setDraggingState(null);
  };

  if (!fsm) return <div className="text-center text-red-500 mt-10">FSM not found</div>;

  return (
    <div className="min-h-screen bg-primary pt-10">
        <div className="flex justify-center">
            <canvas
                ref={canvasRef}
                width={1000}
                height={600}
                className="border border-card-border bg-card rounded"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
    </div>
        
  );
};

export default FSMVisualizer;
