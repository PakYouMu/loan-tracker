// Defines the structure for our configuration object for type safety.
type WaveConfig = {
    // Performance
    throttleInterval: number;
    // Physics
    basePhaseIncrement: number;
    maxPhaseIncrement: number;
    velocityThreshold: number;
    velocityDecayFactor: number;
    minLinger: number;
    maxLinger: number;
    lingerVelocityThreshold: number;
    // Appearance
    horizontalInfluence: number;
    globalAmplitude: number;
    globalFrequency: number;
    lineWidth: number;
    amplitudeDampening: number;
};

// Standard configuration for the wave animation.
export const WAVE_CONFIG: WaveConfig = {
    // Performance
    throttleInterval: 16, // Throttles wave creation to once every 16ms (~60fps)
    // Physics
    basePhaseIncrement: 0.069,
    maxPhaseIncrement: 0.369,
    velocityThreshold: 1.5,
    velocityDecayFactor: 0.97,
    minLinger: 600,
    maxLinger: 2200,
    lingerVelocityThreshold: 2.5,
    // Appearance
    horizontalInfluence: 420.69,
    globalAmplitude: 5,
    globalFrequency: 0.02,
    lineWidth: 3,
    amplitudeDampening: 0.2,
};

// A separate configuration for when the user prefers reduced motion.
export const REDUCED_MOTION_CONFIG: WaveConfig = {
    ...WAVE_CONFIG,
    basePhaseIncrement: 0.02,
    maxPhaseIncrement: 0.05,
    horizontalInfluence: 200,
    globalAmplitude: 2,
    amplitudeDampening: 0.02,
};