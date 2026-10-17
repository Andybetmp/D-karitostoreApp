import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import MainVideo from "../assets/WalkingGirl.mp4";
import { motion } from "framer-motion";

const VideoContainer = styled.section`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #202020;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    object-fit: cover;
    z-index: 0;

    @media (max-width: 48em) {
      object-position: center 10%;
    }
    @media (max-width: 30em) {
      object-position: center 50%;
    }
  }
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: ${(props: any) => `rgba(${props.theme.bodyRgba},0.5)`};
`;

const Title = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  pointer-events: none;

  div {
    display: flex;
    flex-direction: row;
  }

  h1 {
    font-family: "Kaushan Script";
    font-size: ${(props) => props.theme.fontBig};
    text-shadow: 2px 2px 8px ${(props) => props.theme.body};

    @media (max-width: 30em) {
      font-size: calc(4.5rem + 7vw);
    }
  }

  h2 {
    font-family: "Sirin Stencil";
    font-size: ${(props) => props.theme.fontlg};
    text-shadow: 1px 1px 4px ${(props) => props.theme.body};
    font-weight: 400;
    text-transform: capitalize;
    text-align: center;
    padding: 0 1rem;

    @media (max-width: 30em) {
      font-size: ${(props) => props.theme.fontmd};
      margin-top: -1rem;
    }
  }
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 1.2,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CoverVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.play().catch(() => {});
    }
  }, []);

  return (
    <VideoContainer>
      <video
        ref={videoRef}
        src={MainVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <DarkOverlay />
      <Title variants={container} initial="hidden" animate="show">
        <div>
          <motion.h1 variants={item} data-scroll data-scroll-delay="0.13" data-scroll-speed="4">
            b
          </motion.h1>
          <motion.h1 variants={item} data-scroll data-scroll-delay="0.09" data-scroll-speed="4">
            o
          </motion.h1>
          <motion.h1 variants={item} data-scroll data-scroll-delay="0.06" data-scroll-speed="4">
            l
          </motion.h1>
          <motion.h1 variants={item} data-scroll data-scroll-delay="0.04" data-scroll-speed="4">
            d
          </motion.h1>
        </div>
        <motion.h2 variants={item} data-scroll data-scroll-delay="0.04" data-scroll-speed="2">
          Cada pieza, una historia de elegancia y carácter
        </motion.h2>
      </Title>
    </VideoContainer>
  );
};

export default CoverVideo;
