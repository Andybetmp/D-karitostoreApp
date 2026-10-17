import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  touch-action: none;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};

  svg {
    width: 8rem;
    height: auto;
    overflow: visible;
    stroke-linejoin: round;
    stroke-linecap: round;

    g {
      path {
        stroke: ${(props) => props.theme.text};
        stroke-width: 1.2;
      }
    }
  }

  @media (max-width: 48em) {
    svg {
      width: 6rem;
    }
  }
`;

const Text = styled(motion.span)`
  font-size: ${(props) => props.theme.fontxl};
  font-family: "Kaushan Script";
  color: ${(props) => props.theme.text};
  padding-top: 0.75rem;

  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const textVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 1.8,
      ease: "easeInOut",
    },
  },
};

const Loader = () => {
  return (
    <Container
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 24 24"
        height="48px"
        viewBox="0 0 24 24"
        width="48px"
        fill="none"
      >
        <g>
          <motion.path
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
          />
        </g>
      </svg>
      <Text variants={textVariants} initial="hidden" animate="visible">
        D’KaritoStore
      </Text>
    </Container>
  );
};

export default Loader;
