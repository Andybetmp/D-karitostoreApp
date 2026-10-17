import React from "react";
import { Link } from "react-router-dom";
import { rootPaths } from "../routes/paths";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  width: auto;
  color: ${(props) => props.theme.text};
  z-index: 25;

  a {
    display: flex;
    align-items: flex-end;
    gap: 0.4rem;
  }

  svg {
    width: 3.5rem;
    height: auto;
    overflow: visible;
    stroke-linejoin: round;
    stroke-linecap: round;

    g {
      path {
        stroke: ${(props) => props.theme.text};
      }
    }
  }
`;

const Text = styled(motion.span)`
  font-size: ${(props) => props.theme.fontlg};
  font-family: "Kaushan Script";
  color: ${(props) => props.theme.text};
  padding-bottom: 0.4rem;
`;

const textVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, delay: 2.2, ease: "easeInOut" },
  },
};

const pathVariants = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 1.4, delay: 2.0, ease: "easeInOut" },
  },
};

const Logo = () => {
  return (
    <Container>
      <Link to={rootPaths.homeRoot}>
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
          D&apos;KaritoStore
        </Text>
      </Link>
    </Container>
  );
};

export default Logo;
