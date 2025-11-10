'use client';

import { useState, useEffect } from 'react';
import { X, Waves } from 'lucide-react';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  highlight?: { 
    top?: string; 
    bottom?: string; 
    left?: string; 
    right?: string; 
    width?: string; 
    height?: string;
    borderRadius?: string; // ADDED: borderRadius property
  };
};

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to La Clair Ligña',
    description: 'This is where you keep your finances straight',
    position: { top: '37.8%', left: '40%' },

  },
  {
    id: 'wave',
    title: 'Interactive Waves',
    description: 'Move your cursor across the screen to disturb the waves. Each movement creates unique patterns.',
    position: { top: '65%', left: '38.5%' },
    highlight: { bottom: '47%', left: '0vw', width: '100vw', height: '3vw', borderRadius: '0px' },
  },
  {
    id: 'motion-toggle',
    title: 'Gentle Mode',
    description: 'If the movement feels too intense, click here to enable a calmer, gentler wave animation.',
    position: { bottom: '110px', left: '25px' },
    // MODIFIED: Added borderRadius
    highlight: { bottom: '28px', left: '28px', width: '64px', height: '64px', borderRadius: '32px' },
  },
  {
    id: 'theme',
    title: 'Theme Switcher',
    description: 'Toggle between light and dark modes, or let it follow your system preference.',
    position: { top: '40px', right: '250px' },
    // MODIFIED: Added borderRadius
    highlight: { top: '41px', right: '182px', width: '48px', height: '42px', borderRadius: '8px' },
  },
  {
    id: 'logo',
    title: 'Home',
    description: 'Click the logo anytime to return to this page.',
    position: { top: '120px', left: '27px' },

    // MODIFIED: Added borderRadius
    highlight: { top: '26px', left: '26px', width: '380px', height: '76px', borderRadius: '12px' },
  },
  {
    id: 'auth',
    title: 'Sign In',
    description: 'Ready to track your finances? Sign in or create an account here.',
    position: { top: '120px', right: '50px' },

    // MODIFIED: Added borderRadius
    highlight: { top: '46px', right: '32px', width: '138px', height: '32px', borderRadius: '6px' },
  },
];

export default function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('tutorial-completed');
    if (!completed) {
      setIsVisible(true);
    } else {
      setHasCompleted(true);
    }
  }, []);

  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('tutorial-completed', 'true');
    setHasCompleted(true);
  };

  if (hasCompleted || !isVisible) {
    return null;
  }

  return (
    <>
      {/* MODIFIED: The highlight element now creates the overlay via box-shadow */}
      {step.highlight && (
        <div
          className="fixed z-30 pointer-events-none"
          style={{
            top: step.highlight.top,
            bottom: step.highlight.bottom,
            left: step.highlight.left,
            right: step.highlight.right,
            width: step.highlight.width,
            height: step.highlight.height,
            borderRadius: step.highlight.borderRadius,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      )}

      {/* MODIFIED: A separate, simple backdrop for steps without a highlight */}
      {!step.highlight && (
         <div className="fixed inset-0 bg-black/60 z-30 pointer-events-auto" />
      )}

      {/* Tutorial card (remains on top) */}
      <div
        className="absolute z-50 max-w-md pointer-events-auto"
        style={{
          top: step.position.top,
          bottom: step.position.bottom,
          left: step.position.left,
          right: step.position.right,
          transform: step.position.top === '50%' && step.position.left === '50%' ? 'translate(-50%, -50%)' : 'none',
        }}
      >
        <div className="bg-background border-2 border-foreground/20 rounded-2xl shadow-2xl p-6">
          {/* Close button
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button> */}

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-center">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-center mt-3">{step.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-foreground'
                    : 'w-2 bg-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors font-medium"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors font-medium"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Got it!' : 'Next'}
            </button>
          </div>

          {/* Step counter */}
          <p className="text-center text-sm text-muted-foreground mt-3">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>
      </div>
    </>
  );
}