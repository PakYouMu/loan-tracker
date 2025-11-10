"use client";

import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { WAVE_CONFIG, REDUCED_MOTION_CONFIG } from '@/wave.config';

type WaveSource = {
    id: number;
    x: number;
    y: number;
    strength: number;
    creationTime: number;
    initialIntensity: number;
};

// --- RESTORED: Component accepts children again ---
const InteractiveWaveBackground = ({
    children,
    reducedMotion = false
}: {
    children: React.ReactNode;
    reducedMotion?: boolean;
}) => {
    const config = reducedMotion ? REDUCED_MOTION_CONFIG : WAVE_CONFIG;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const waveSources = useRef<WaveSource[]>([]);
    const nextSourceId = useRef(0);
    const isMouseOver = useRef(false);
    const hasInitialized = useRef(false);
    const lastMousePosition = useRef<{ x: number; y: number; timestamp: number }>({ x: 0, y: 0, timestamp: 0 });
    const mouseVelocity = useRef(0);
    const phase = useRef(0);
    const mouseWaveFrequency = useRef(0.04);
    const mouseWaveSpeed = useRef(1.69);
    const mouseWaveAmplitude = useRef(1.0);
    const amplitudeNodes = useRef(new Map());


    const randomizeWaveParameters = useCallback(() => {
        mouseWaveFrequency.current = 0.02 + Math.random() * 0.05;
        mouseWaveSpeed.current = 0.5 + Math.random() * 0.4;
        mouseWaveAmplitude.current = 0.1 + Math.random() * 0.2;
    }, []);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        offscreenCanvasRef.current = document.createElement('canvas');
        offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d');
        const offscreenCtx = offscreenCtxRef.current;
        if (!offscreenCtx) return;

        const nodeSpacing = Math.PI;

        const getAmplitudeNode = (nodeIndex: number) => {
            if (!amplitudeNodes.current.has(nodeIndex)) {
                amplitudeNodes.current.set(nodeIndex, 0.4 + Math.random() * 0.6);
            }
            return amplitudeNodes.current.get(nodeIndex);
        };

        const resizeCanvas = (width: number, height: number) => {
            canvas.width = width;
            canvas.height = height;
            if (offscreenCanvasRef.current) {
                offscreenCanvasRef.current.width = width;
                offscreenCanvasRef.current.height = height;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (!isMouseOver.current || reducedMotion) return;
            const now = performance.now();
            const deltaTime = now - lastMousePosition.current.timestamp;
            if (deltaTime > 0) {
                const deltaX = x - lastMousePosition.current.x;
                const deltaY = y - lastMousePosition.current.y;
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                const instantaneousVelocity = distance / deltaTime;
                const VELOCITY_SMOOTHING_FACTOR = 0.2;
                mouseVelocity.current = (instantaneousVelocity * VELOCITY_SMOOTHING_FACTOR) + (mouseVelocity.current * (1 - VELOCITY_SMOOTHING_FACTOR));
            }
            lastMousePosition.current = { x, y, timestamp: now };
            waveSources.current.push({
                id: nextSourceId.current++,
                x,
                y,
                strength: 1.0,
                creationTime: now,
                initialIntensity: mouseVelocity.current,
            });
        };
        const handleDocumentMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
                isMouseOver.current = false;
                hasInitialized.current = false;
            }
        };
        const handleDocumentMouseEnter = (e: MouseEvent) => {
            if (!hasInitialized.current) {
                randomizeWaveParameters();
                hasInitialized.current = true;
            }
            isMouseOver.current = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            lastMousePosition.current = { x, y, timestamp: performance.now() };
        };

        const draw = () => {
            const now = performance.now();
            const offscreenCanvas = offscreenCanvasRef.current;
            const offscreenCtx = offscreenCtxRef.current;
            if (!offscreenCtx || !offscreenCanvas || offscreenCanvas.width <= 0 || offscreenCanvas.height <= 0) {
                animationFrameId.current = requestAnimationFrame(draw);
                return;
            }

            waveSources.current = waveSources.current.map(source => {
                const intensityRatio = Math.min(source.initialIntensity / config.lingerVelocityThreshold, 1.0);
                const lingerDuration = config.minLinger + (config.maxLinger - config.minLinger) * intensityRatio;
                const age = now - source.creationTime;
                const progress = Math.min(age / lingerDuration, 1.0);
                const decayFactor = (1.0 - progress) ** 2;
                return { ...source, strength: decayFactor };
            }).filter(source => source.strength > 0.001);

            mouseVelocity.current *= config.velocityDecayFactor;
            
            const speedInterpolation = Math.min(mouseVelocity.current / config.velocityThreshold, 1.0);
            const dynamicPhaseIncrement = config.basePhaseIncrement + (config.maxPhaseIncrement - config.basePhaseIncrement) * speedInterpolation;
            
            offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            offscreenCtx.beginPath();
            offscreenCtx.moveTo(0, offscreenCanvas.height / 2);

            for (let i = 0; i < offscreenCanvas.width; i++) {
                const globalWave = Math.sin((i * config.globalFrequency) + phase.current) * config.globalAmplitude;
                let totalMouseDisplacement = 0;
                let totalFalloff = 0;

                for (const source of waveSources.current) {
                    const distanceToSourceX = Math.abs(i - source.x);
                    if (distanceToSourceX < config.horizontalInfluence) {
                        const normalizedDistance = distanceToSourceX / config.horizontalInfluence;
                        const t = 1.0 - normalizedDistance;
                        const horizontalFalloff = t * t * (3.0 - 2.0 * t);
                        const maxDistance = offscreenCanvas.height / 2;
                        const currentDistance = Math.abs(source.y - maxDistance);
                        const adverseAmplitude = (1 - (currentDistance / maxDistance)) * maxDistance * config.amplitudeDampening;
                        const wavePhase = (i * mouseWaveFrequency.current) + (phase.current * mouseWaveSpeed.current);
                        const sineWave = Math.sin(wavePhase);
                        const nodeIndex1 = Math.floor(wavePhase / nodeSpacing);
                        const nodeIndex2 = nodeIndex1 + 1;
                        const amp1 = getAmplitudeNode(nodeIndex1);
                        const amp2 = getAmplitudeNode(nodeIndex2);
                        const fractionalPos = (wavePhase % nodeSpacing) / nodeSpacing;
                        const smoothFractionalPos = (1 - Math.cos(fractionalPos * Math.PI)) / 2;
                        const interpolatedAmplitude = amp1 * (1 - smoothFractionalPos) + amp2 * smoothFractionalPos;
                        const displacement = sineWave * adverseAmplitude * horizontalFalloff * mouseWaveAmplitude.current * interpolatedAmplitude * source.strength;
                        totalMouseDisplacement += displacement;
                        totalFalloff = Math.max(totalFalloff, horizontalFalloff * source.strength);
                    }
                }
                const finalY = offscreenCanvas.height / 2 + (globalWave * (1 - totalFalloff)) + totalMouseDisplacement;
                offscreenCtx.lineTo(i, finalY);
            }

            const style = getComputedStyle(canvas);
            const foregroundColorValue = style.getPropertyValue('--foreground');
            offscreenCtx.strokeStyle = `hsl(${foregroundColorValue})`;
            offscreenCtx.lineWidth = config.lineWidth;
            offscreenCtx.stroke();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offscreenCanvas, 0, 0);

            phase.current += dynamicPhaseIncrement;
            const phaseAtLeftEdge = phase.current * mouseWaveSpeed.current;
            const firstVisibleNodeIndex = Math.floor(phaseAtLeftEdge / nodeSpacing);
            for (const key of amplitudeNodes.current.keys()) {
                if (key < firstVisibleNodeIndex - 20) {
                    amplitudeNodes.current.delete(key);
                }
            }
            animationFrameId.current = requestAnimationFrame(draw);
        };

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) resizeCanvas(entry.contentRect.width, entry.contentRect.height);
        });
        observer.observe(container);
        if (!hasInitialized.current) {
            randomizeWaveParameters();
            hasInitialized.current = true;
        }
        // --- MODIFIED: The main canvas itself now handles mouse move for cursor position ---
        canvas.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleDocumentMouseLeave);
        document.addEventListener('mouseenter', handleDocumentMouseEnter);
        animationFrameId.current = requestAnimationFrame(draw);

        return () => {
            observer.disconnect();
            canvas.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleDocumentMouseLeave);
            document.removeEventListener('mouseenter', handleDocumentMouseEnter);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [config, randomizeWaveParameters, reducedMotion]);

    return (
        <main ref={containerRef} className="absolute inset-0 w-full h-full grid">
            <canvas ref={canvasRef} className="z-0 col-start-1 row-start-1" />
            <div className="z-10 col-start-1 row-start-1 grid place-items-center pointer-events-none">
              {children}
            </div>
        </main>
    )
};

export default InteractiveWaveBackground;