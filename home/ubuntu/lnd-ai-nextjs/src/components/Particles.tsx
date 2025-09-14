"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles";

const CosmicParticles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#000000", // AMOLED black background
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#8B5CF6", // Accent purple for stars
            animation: {
              enable: true,
              speed: 10,
              sync: true,
            },
          },
          links: {
            color: "#6366F1", // Light purple for links
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: "bottom", // Falling stars effect
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 1,
            straight: false,
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#8B5CF6",
              },
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: {
              min: 1,
              max: 5
            },
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.3,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default CosmicParticles;

