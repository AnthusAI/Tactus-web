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
  Folder
} from "lucide-react";
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const ContainerSandboxDiagram = ({
  theme = "light",
  style,
  className,
}) => {
  const t = diagramTokens;

  // Layout Constants
  const width = 960;
  const height = 400;

  // --- Host Infrastructure (Left Large Box) ---
  const hostX = 20;
  const hostY = 50;
  const hostW = 660;
  const hostH = 340; // Reduced from 380

  // --- Runtime Container (Inside Host, Left) ---
  const contX = hostX + 30;
  const contY = hostY + 50;
  const contW = 280;
  const contH = hostH - 70; // 270

  // --- Lua Sandbox (Inside Container) ---
  const sandX = contX + 25;
  const sandY = contY + 50;
  const sandW = contW - 50;
  const sandH = 100; // Reduced from 120

  // --- File System (Inside Container, Below Sandbox) ---
  const fsY = sandY + sandH + 15; // Tighter gap
  const fsH = 50; // Slightly shorter boxes
  // Two boxes side-by-side: File System & Bash Tools
  // Total width available inside container padding: sandW
  // Let's split it: sandW is roughly 230px.
  // We can make them stack vertically or squeeze them horizontally.
  // Actually, sandW = contW - 50 = 280 - 50 = 230.
  // Squeezing side-by-side might be tight (110px each).
  // Let's try side-by-side with smaller icons.
  
  const subBoxW = (sandW - 10) / 2;
  const fsX = sandX;
  const bashX = sandX + subBoxW + 10;

  // --- Secret Broker (Inside Host, Right) ---
  const brokX = contX + contW + 40;
  const brokY = contY; // Align tops
  const brokW = 280;
  const brokH = contH; // Same height as container

  // --- External World (Outside Host, Far Right) ---
  const extX = hostX + hostW + 20;
  const extY = hostY;
  const extW = 240;
  const extH = hostH;

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
      aria-label="Diagram showing Tactus architecture: Lua sandbox inside a networkless container, connecting to external APIs via a trusted broker that holds the secrets."
    >
      <defs>
        <marker
          id="csdArrow"
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
      
      {/* Label - moved slightly higher */}
      <g transform={`translate(${hostX}, ${hostY - 22})`}>
        <Monitor size={18} color={t.muted} />
        <text x={26} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          Host Infrastructure
        </text>
      </g>

      {/* Box */}
      <rect 
        x={hostX} y={hostY} width={hostW} height={hostH} 
        rx={8} fill={t.surface2} stroke={t.border} strokeWidth="1" 
      />

      {/* =========================================
          RUNTIME CONTAINER
         ========================================= */}

      {/* Label - moved slightly higher */}
      <g transform={`translate(${contX}, ${contY - 22})`}>
        <Box size={18} color={t.muted} />
        <text x={26} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          Runtime Container
        </text>
        <text x={160} y={14} fill={t.red} fontSize="12" fontWeight="600" fontFamily={t.fontMono}>
          (Network: None)
        </text>
      </g>

      {/* Box */}
      <rect 
        x={contX} y={contY} width={contW} height={contH} 
        rx={8} fill={t.surface} stroke={t.border} strokeWidth="1" 
      />
      {/* Dashed Outline */}
      <rect 
        x={contX} y={contY} width={contW} height={contH} 
        rx={10} fill="none" stroke={t.ink} strokeWidth="2.5" strokeDasharray="8 6" opacity={0.5}
      />

      {/* =========================================
          LUA SANDBOX
         ========================================= */}

      {/* Label - moved slightly higher */}
      <g transform={`translate(${sandX}, ${sandY - 22})`}>
        <Code2 size={18} color={t.primary} />
        <text x={26} y={14} fill={t.ink} fontSize="15" fontWeight="800" fontFamily={t.fontSans}>
          Lua Sandbox
        </text>
      </g>

      {/* Box */}
      <rect 
        x={sandX} y={sandY} width={sandW} height={sandH} 
        rx={8} fill={t.codeBg} stroke="none"
      />
      {/* Dashed Outline */}
      <rect 
        x={sandX} y={sandY} width={sandW} height={sandH} 
        rx={8} fill="none" stroke={t.primary} strokeWidth="3" strokeDasharray="8 6"
      />

      {/* Code Snippet */}
      <g transform={`translate(${sandX + 15}, ${sandY + 25})`}>
          <text fill={t.code} fontSize="13" fontFamily={t.fontMono} style={{ whiteSpace: "pre" }}>
              <tspan x="0" dy="0">worker = Agent &#123;</tspan>
              <tspan x="10" dy="18">provider = "openai",</tspan>
              <tspan x="10" dy="18">tools = &#123;search&#125;</tspan>
              <tspan x="0" dy="18">&#125;</tspan>
          </text>
      </g>

      {/* =========================================
          FILE SYSTEM & BASH TOOLS (Inside Container)
         ========================================= */}
      
      {/* File System Box */}
      <rect 
        x={fsX} y={fsY} width={subBoxW} height={fsH} rx={4} 
        fill={t.surface2} opacity="0.5"
      />
      
      {/* File System Label */}
      <g transform={`translate(${fsX + 10}, ${fsY + 20})`}>
        <Folder size={16} color={t.muted} />
        <text x={22} y={12} fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans}>
            Files
        </text>
      </g>

      {/* Bash Tools Box */}
      <rect 
        x={bashX} y={fsY} width={subBoxW} height={fsH} rx={4} 
        fill={t.surface2} opacity="0.5"
      />

      {/* Bash Tools Label */}
      <g transform={`translate(${bashX + 10}, ${fsY + 20})`}>
        <Terminal size={16} color={t.muted} />
        <text x={22} y={12} fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans}>
            Bash
        </text>
      </g>

      {/* =========================================
          SECRET BROKER
         ========================================= */}

      {/* Label - moved slightly higher */}
      <g transform={`translate(${brokX}, ${brokY - 22})`}>
        <ShieldCheck size={18} color={t.primary} />
        <text x={26} y={14} fill={t.ink} fontSize="15" fontWeight="800" fontFamily={t.fontSans}>
          Secret Broker
        </text>
      </g>

      {/* Box */}
      <rect 
        x={brokX} y={brokY} width={brokW} height={brokH} 
        rx={8} fill={t.surface} stroke={t.primary} strokeWidth="2" 
      />

      {/* Visual Objects: Keys & Policy */}
      <g transform={`translate(${brokX + 20}, ${brokY + 25})`}>
        
        {/* AI Gateway Visual */}
        <g transform="translate(0, 0)">
            <rect x="0" y="0" width="240" height="50" rx="4" fill={t.surface2} opacity="0.5" />
            <g transform="translate(10, 15)">
                <ShieldCheck size={16} color={t.muted} />
                <text x={22} y={12} fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans} textTransform="uppercase" letterSpacing="0.5">
                    AI Gateway
                </text>
            </g>
        </g>

        {/* Tool Gateway Visual */}
        <g transform="translate(0, 60)">
            <rect x="0" y="0" width="240" height="50" rx="4" fill={t.surface2} opacity="0.5" />
            <g transform="translate(10, 15)">
                <Globe size={16} color={t.muted} />
                <text x={22} y={12} fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans} textTransform="uppercase" letterSpacing="0.5">
                    Tool Gateway
                </text>
            </g>
        </g>

        {/* Security Layer: Secrets & Policies */}
        <g transform="translate(0, 120)">
            <rect x="0" y="0" width="240" height="100" rx="4" fill={t.cardTitle} stroke={t.border} strokeWidth="1" strokeDasharray="4 4" />
            <text x="10" y="20" fill={t.muted} fontSize="11" fontWeight="700" fontFamily={t.fontSans} textTransform="uppercase" letterSpacing="0.5">
                Security Layer
            </text>
            
            {/* Secrets */}
            <g transform="translate(10, 35)">
                <Key size={14} color={t.primary} />
                <text x={20} y={10} fill={t.code} fontSize="11" fontFamily={t.fontMono}>OPENAI_API_KEY</text>
            </g>
            <g transform="translate(130, 35)">
                <Key size={14} color={t.primary} />
                <text x={20} y={10} fill={t.code} fontSize="11" fontFamily={t.fontMono}>AWS_KEY</text>
            </g>

            {/* Policies */}
            <g transform="translate(10, 65)">
                <Lock size={14} color={t.ink} />
                <text x={20} y={10} fill={t.ink} fontSize="11" fontFamily={t.fontSans} fontWeight="600">Policy: Allow search, read</text>
            </g>
        </g>

      </g>

      {/* =========================================
          EXTERNAL WORLD
         ========================================= */}

      {/* Label - moved slightly higher */}
      <g transform={`translate(${extX + 20}, ${extY - 22})`}>
        <Globe size={18} color={t.muted} />
        <text x={34} y={14} fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          External World
        </text>
      </g>

      {/* Box */}
      <rect 
        x={extX} y={extY} width={extW} height={extH} 
        rx={8} fill="none" stroke={t.border} strokeWidth="1" strokeDasharray="4 4"
      />

      {/* Densely packed external services */}
      <g transform={`translate(${extX + 20}, ${extY + 40})`}>
         
         {/* OpenAI */}
         <g transform="translate(0, 0)">
            <Cloud size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>OpenAI API</text>
         </g>

         {/* Google */}
         <g transform="translate(0, 40)">
            <Cloud size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>Google Cloud</text>
         </g>

         {/* AWS */}
         <g transform="translate(0, 80)">
            <Server size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>AWS</text>
         </g>

         {/* Email */}
         <g transform="translate(0, 120)">
            <Mail size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>SMTP / Email</text>
         </g>

         {/* Search */}
         <g transform="translate(0, 160)">
            <Search size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>Search / Web</text>
         </g>

         {/* Database/CMS */}
         <g transform="translate(0, 200)">
            <Database size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>CMS / DB</text>
         </g>

         {/* Github */}
         <g transform="translate(0, 240)">
            <Cloud size={24} color={t.text} fill="none" strokeWidth={1.5} />
            <text x={34} y={18} fill={t.text} fontSize="13" fontWeight="600" fontFamily={t.fontSans}>Github / Git</text>
         </g>

         {/* Others */}
         <g transform="translate(0, 280)">
            <text x={34} y={18} fill={t.muted} fontSize="13" fontWeight="500" fontFamily={t.fontSans} fontStyle="italic">Others...</text>
         </g>

      </g>


      {/* =========================================
          ARROWS
         ========================================= */}
      
      {/* 1. Sandbox <-> Broker */}
      {/* Straight horizontal line */}
      <path
        d={`M ${sandX + sandW + 10} ${contY + contH/2} L ${brokX - 10} ${contY + contH/2}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="3"
        markerEnd="url(#csdArrow)"
        markerStart="url(#csdArrow)"
      />
      
       {/* 2. Broker <-> External */}
       {/* Straight horizontal line */}
       <path
        d={`M ${brokX + brokW + 10} ${contY + contH/2} L ${extX - 10} ${contY + contH/2}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="3"
        markerEnd="url(#csdArrow)"
        markerStart="url(#csdArrow)"
      />

    </svg>
  );
};

export default ContainerSandboxDiagram;
