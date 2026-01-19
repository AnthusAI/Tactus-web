import * as React from "react";
import { 
  Box, 
  Container, 
  ShieldCheck, 
  Globe, 
  Key, 
  Lock, 
  Code2,
  Server,
  Cloud,
  Mail,
  Search,
  Database,
  Monitor,
  Terminal,
  Folder,
  Wrench,
  Cpu,
  Zap
} from "lucide-react";
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const IsolatedToolsDiagram = ({
  theme = "light",
  style,
  className,
}) => {
  const t = diagramTokens;

  // Layout Constants
  const width = 960;
  const height = 400;

  // --- Host Infrastructure (Wraps all 3 columns) ---
  const hostX = 20;
  const hostY = 50;
  const hostW = 920;
  const hostH = 340;

  // Column Layout
  const colY = hostY + 50;
  const colH = hostH - 70; // 270
  const colW = 260;
  const gap = 30;

  // 1. Runtime Container (Left)
  const runX = hostX + 30;
  
  // 2. Broker / Trusted (Middle)
  const midX = runX + colW + gap;
  
  // 3. Isolated Container (Right)
  const isoX = midX + colW + gap;

  return (
    <svg
      className={className}
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: t.bg,
        ...style,
      }}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Diagram showing three tool execution environments: Un-trusted tools in the runtime container, Trusted tools on the host, and Isolated tools in a separate container."
    >
      <defs>
        <marker
          id="itdArrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.primary} />
        </marker>
      </defs>

      {/* =========================================
          HOST INFRASTRUCTURE
         ========================================= */}
      
      <g transform={`translate(${hostX}, ${hostY - 22})`}>
        <Monitor size={18} color={t.muted} />
        <text x={26} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          Host Infrastructure
        </text>
      </g>

      <rect 
        x={hostX} y={hostY} width={hostW} height={hostH} 
        rx={8} fill={t.surface2} stroke={t.border} strokeWidth="1" 
      />

      {/* =========================================
          COLUMN 1: RUNTIME CONTAINER
          (Lua Sandbox + Un-trusted Tools)
         ========================================= */}

      <g transform={`translate(${runX}, ${colY - 22})`}>
        <Box size={18} color={t.muted} />
        <text x={26} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          Runtime Container
        </text>
      </g>

      <rect 
        x={runX} y={colY} width={colW} height={colH} 
        rx={8} fill={t.surface} stroke={t.border} strokeWidth="1" 
      />
      {/* Dashed Outline */}
      <rect 
        x={runX} y={colY} width={colW} height={colH} 
        rx={10} fill="none" stroke={t.ink} strokeWidth="2.5" strokeDasharray="8 6" opacity={0.5}
      />

      {/* Content: Lua Sandbox */}
      <g transform={`translate(${runX + 20}, ${colY + 20})`}>
        <rect x="0" y="0" width={colW - 40} height={100} rx={8} fill={t.codeBg} />
        <rect x="0" y="0" width={colW - 40} height={100} rx={8} fill="none" stroke={t.primary} strokeWidth="2" strokeDasharray="6 4" />
        
        <g transform="translate(15, 20)">
            <Code2 size={16} color={t.primary} />
            <text x={24} y={12} fill={t.ink} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>Lua Sandbox</text>
            <text x={0} y={40} fill={t.code} fontSize="11" fontFamily={t.fontMono}>agent()</text>
            <text x={0} y={56} fill={t.code} fontSize="11" fontFamily={t.fontMono}>-- logic & flow</text>
        </g>
      </g>

      {/* Content: Un-trusted Tools */}
      <g transform={`translate(${runX + 20}, ${colY + 140})`}>
        <rect x="0" y="0" width={colW - 40} height={100} rx={4} fill={t.surface2} opacity="0.6" />
        
        <g transform="translate(15, 20)">
            <Wrench size={16} color={t.text} />
            <text x={24} y={12} fill={t.text} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>Un-trusted Tools</text>
            <text x={0} y={40} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>
                • User-contributed code
            </text>
            <text x={0} y={56} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>
                • AI-generated code
            </text>
        </g>
      </g>


      {/* =========================================
          COLUMN 2: BROKER & TRUSTED TOOLS
          (Host Level)
         ========================================= */}

      <g transform={`translate(${midX}, ${colY - 22})`}>
        <ShieldCheck size={18} color={t.primary} />
        <text x={26} y={14} fill={t.ink} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Secret Broker
        </text>
      </g>

      {/* Broker Box (Top Half) */}
      <rect 
        x={midX} y={colY} width={colW} height={120} 
        rx={8} fill={t.surface} stroke={t.primary} strokeWidth="2" 
      />
      
      <g transform={`translate(${midX + 20}, ${colY + 25})`}>
         <g transform="translate(0, 0)">
            <Key size={14} color={t.primary} />
            <text x={20} y={10} fill={t.code} fontSize="11" fontFamily={t.fontMono}>API_KEYS</text>
         </g>
         <g transform="translate(0, 25)">
            <Lock size={14} color={t.ink} />
            <text x={20} y={10} fill={t.ink} fontSize="11" fontFamily={t.fontSans} fontWeight="600">Access Policies</text>
         </g>
         <text x={0} y={75} fill={t.muted} fontSize="12" fontStyle="italic" fontFamily={t.fontSerif}>
            Routes requests
         </text>
      </g>

      {/* Trusted Tools (Bottom Half - Inside Host) */}
      <g transform={`translate(${midX}, ${colY + 140})`}>
        <rect x="0" y="0" width={colW} height={100} rx={8} fill={t.surface} stroke={t.border} strokeWidth="1" />
        
        <g transform="translate(15, 15)">
            <Wrench size={16} color={t.ink} />
            <text x={24} y={12} fill={t.ink} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>Trusted Tools</text>
            <text x={130} y={12} fill={t.muted} fontSize="11" fontFamily={t.fontMono}>(Host)</text>
            
            <g transform="translate(0, 35)">
                <text x={0} y={0} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>• Standard Library</text>
                <text x={0} y={16} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>• Admin-vetted tools</text>
            </g>
        </g>
      </g>


      {/* =========================================
          COLUMN 3: ISOLATED CONTAINER
          (Isolated Tools)
         ========================================= */}

      <g transform={`translate(${isoX}, ${colY - 22})`}>
        <Box size={18} color={t.muted} />
        <text x={26} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          Isolated Container
        </text>
      </g>

      <rect 
        x={isoX} y={colY} width={colW} height={colH} 
        rx={8} fill={t.surface} stroke={t.border} strokeWidth="1" 
      />
      {/* Dashed Outline */}
      <rect 
        x={isoX} y={colY} width={colW} height={colH} 
        rx={10} fill="none" stroke={t.ink} strokeWidth="2.5" strokeDasharray="8 6" opacity={0.5}
      />

      {/* Content: Isolated Tools */}
      <g transform={`translate(${isoX + 20}, ${colY + 85})`}>
        <rect x="0" y="0" width={colW - 40} height={100} rx={4} fill={t.surface2} opacity="0.6" />
        
        <g transform="translate(15, 20)">
            <Wrench size={16} color={t.primary} />
            <text x={24} y={12} fill={t.text} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>Isolated Tools</text>
            <text x={0} y={40} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>
                • User-contributed code
            </text>
            <text x={0} y={56} fill={t.muted} fontSize="11" fontFamily={t.fontSans}>
                • AI-generated code
            </text>
        </g>
      </g>


      {/* =========================================
          ARROWS
         ========================================= */}
      
      {/* 1. Sandbox -> Broker */}
      <path
        d={`M ${runX + colW - 20} ${colY + 70} 
            C ${runX + colW + 20} ${colY + 70},
              ${midX - 20} ${colY + 60},
              ${midX} ${colY + 60}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="3"
        markerEnd="url(#itdArrow)"
      />

      {/* 2. Broker -> Un-trusted Tools (Loop back) */}
      <path
        d={`M ${midX} ${colY + 90}
            C ${midX - 30} ${colY + 90},
              ${runX + colW + 30} ${colY + 190},
              ${runX + colW - 20} ${colY + 190}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="2"
        strokeDasharray="4 4"
        markerEnd="url(#itdArrow)"
      />

      {/* 3. Broker -> Trusted Tools (Down) */}
      <path
        d={`M ${midX + colW/2} ${colY + 120} L ${midX + colW/2} ${colY + 140}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="2"
        markerEnd="url(#itdArrow)"
      />

      {/* 4. Broker -> Isolated Tools (Right) */}
      <path
        d={`M ${midX + colW} ${colY + 60} 
            C ${midX + colW + 40} ${colY + 60},
              ${isoX - 20} ${colY + 135},
              ${isoX} ${colY + 135}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="3"
        markerEnd="url(#itdArrow)"
      />

    </svg>
  );
};

export default IsolatedToolsDiagram;
