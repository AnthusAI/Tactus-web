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
  Terminal
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
  const hostH = 330;

  // --- Runtime Container (Inside Host, Left) ---
  const contX = hostX + 30;
  const contY = hostY + 50;
  const contW = 280;
  const contH = hostH - 80;

  // --- Lua Sandbox (Inside Container) ---
  const sandX = contX + 25;
  const sandY = contY + 50;
  const sandW = contW - 50;
  const sandH = contH - 70;

  // --- Secret Broker (Inside Host, Right) ---
  const brokX = contX + contW + 40;
  const brokY = contY; // Align tops
  const brokW = 280;
  const brokH = contH; // Same height as container

  // --- External World (Outside Host, Far Right) ---
  const extX = hostX + hostW + 20; // Reduced gap
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
      <g transform={`translate(${sandX + 15}, ${sandY + 30})`}>
          <text fill={t.code} fontSize="13" fontFamily={t.fontMono} style={{ whiteSpace: "pre" }}>
              <tspan x="0" dy="0">worker = Agent &#123;</tspan>
              <tspan x="10" dy="20">provider = "openai",</tspan>
              <tspan x="10" dy="20">tools = &#123;search&#125;</tspan>
              <tspan x="0" dy="20">&#125;</tspan>
              <tspan x="0" dy="30" fill={t.muted} fontStyle="italic">-- No keys here!</tspan>
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
      <g transform={`translate(${brokX + 20}, ${brokY + 40})`}>
        
        {/* Keys Visual */}
        <g>
            <rect x="0" y="0" width="240" height="60" rx="4" fill={t.surface2} opacity="0.5" />
            <text x="10" y="25" fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans} textTransform="uppercase" letterSpacing="0.5">
                Secrets
            </text>
            <g transform="translate(10, 35)">
                <Key size={16} color={t.primary} />
                <text x="22" y={12} fill={t.code} fontSize="12" fontFamily={t.fontMono}>OPENAI_API_KEY</text>
            </g>
             <g transform="translate(130, 35)">
                <Key size={16} color={t.primary} />
                <text x="22" y={12} fill={t.code} fontSize="12" fontFamily={t.fontMono}>AWS_KEY</text>
            </g>
        </g>

        {/* Policy Visual */}
        <g transform="translate(0, 80)">
            <rect x="0" y="0" width="240" height="60" rx="4" fill={t.surface2} opacity="0.5" />
            <text x="10" y="25" fill={t.muted} fontSize="12" fontWeight="700" fontFamily={t.fontSans} textTransform="uppercase" letterSpacing="0.5">
                Policy
            </text>
            <g transform="translate(10, 35)">
                <Lock size={16} color={t.ink} />
                <text x="22" y={12} fill={t.ink} fontSize="12" fontFamily={t.fontSans} fontWeight="600">Allow: search, read</text>
            </g>
        </g>

        <text x="0" y="170" fill={t.muted} fontSize="13" fontStyle="italic" fontFamily={t.fontSerif}>
            "Agent asks for work,<br/>Broker attaches the keys."
        </text>

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
        d={`M ${sandX + sandW + 10} ${sandY + sandH/2} L ${brokX - 10} ${sandY + sandH/2}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="3"
        markerEnd="url(#csdArrow)"
        markerStart="url(#csdArrow)"
      />
      
       {/* 2. Broker <-> External */}
       {/* Straight horizontal line */}
       <path
        d={`M ${brokX + brokW + 10} ${brokY + brokH/2} L ${extX - 10} ${brokY + brokH/2}`}
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
