"use client";

import { useEffect, useRef } from "react";

export default function V8WarmAnimations() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Session-based intro animation caching
    const hasSeenIntro = sessionStorage.getItem("v8-hero-intro");
    if (hasSeenIntro) {
      document.body.classList.add("skip-intro");
    } else {
      sessionStorage.setItem("v8-hero-intro", "true");
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Progress nav active state
    const progressDots = document.querySelectorAll(".progress-dot");
    const sections = document.querySelectorAll("section[id]");

    if (progressDots.length && sections.length) {
      const observerOptions = {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeSection = entry.target.id;
            progressDots.forEach((dot) => {
              dot.classList.remove("active");
              if ((dot as HTMLElement).dataset.section === activeSection) {
                dot.classList.add("active");
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach((section) => observer.observe(section));
    }

    // Scroll animations (CSS-based fallback - no GSAP dependency)
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );
    animatedElements.forEach((el) => animObserver.observe(el));

    // Staggered children animation
    document.querySelectorAll(".stagger-children").forEach((container) => {
      const staggerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("stagger-animate");
            }
          });
        },
        { threshold: 0.1 }
      );
      staggerObserver.observe(container);
    });

    // Pause looping animations when off-screen (saves GPU resources)
    if (!prefersReducedMotion) {
      // Pause accent orbs when not visible
      const orbs = document.querySelectorAll(".accent-orb");
      const orbObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            (entry.target as HTMLElement).style.animationPlayState =
              entry.isIntersecting ? "running" : "paused";
          });
        },
        { threshold: 0 }
      );
      orbs.forEach((orb) => orbObserver.observe(orb));

      // Pause marquee when not visible
      const marqueeTrack = document.querySelector(".app-marquee-track");
      if (marqueeTrack) {
        const marqueeObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              (entry.target as HTMLElement).style.animationPlayState =
                entry.isIntersecting ? "running" : "paused";
            });
          },
          { threshold: 0 }
        );
        marqueeObserver.observe(marqueeTrack);
      }
    }

    // Subtle mouse parallax on orbs (desktop only)
    if (
      !prefersReducedMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      const orbs = document.querySelectorAll(".accent-orb");
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let rafId: number;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      document.addEventListener("mousemove", handleMouseMove);

      function animateOrbs() {
        // Smooth interpolation
        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        orbs.forEach((orb, index) => {
          const factor = (index + 1) * 6;
          const offsetX = targetX * factor;
          const offsetY = targetY * factor;
          (orb as HTMLElement).style.setProperty("--mouse-x", `${offsetX}px`);
          (orb as HTMLElement).style.setProperty("--mouse-y", `${offsetY}px`);
        });

        rafId = requestAnimationFrame(animateOrbs);
      }
      animateOrbs();

      // Cleanup function
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, []);

  return null;
}

// Email validation component
export function EmailValidation() {
  useEffect(() => {
    const emailInputs = document.querySelectorAll(".v8-email-input");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      const isValid = emailRegex.test(value);

      if (value === "") {
        input.classList.remove("valid", "invalid");
        input.removeAttribute("aria-invalid");
      } else if (isValid) {
        input.classList.remove("invalid");
        input.classList.add("valid");
        input.setAttribute("aria-invalid", "false");
      } else {
        input.classList.remove("valid");
        input.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
      }
    };

    const handleBlur = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      if (value !== "" && !emailRegex.test(value)) {
        input.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
      }
    };

    emailInputs.forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      emailInputs.forEach((input) => {
        input.removeEventListener("input", handleInput);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  return null;
}
