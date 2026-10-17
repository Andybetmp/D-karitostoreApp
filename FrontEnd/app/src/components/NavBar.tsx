import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { rootPaths } from "../routes/paths";
import LoginButton from "./LoginButton";
import CartIcon from "./CartIcon";

const NavContainer = styled(motion.div)<{ $click: boolean }>`
  width: 100vw;
  z-index: 20;
  position: absolute;
  top: ${(props) => (props.$click ? "0" : `-${props.theme.navHeight}`)};
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: top 0.35s ease;

  @media (max-width: 40em) {
    top: ${(props) => (props.$click ? "0" : `calc(-50vh - 4rem)`)};
  }
`;

const MenuItems = styled(motion.ul)`
  position: relative;
  height: ${(props) => props.theme.navHeight};
  background-color: rgba(32, 32, 32, 0.88);
  backdrop-filter: blur(8px);
  color: ${(props) => props.theme.text};
  list-style: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 0 8rem 0 14rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 40em) {
    flex-direction: column;
    padding: 2rem 0;
    height: 50vh;
  }
`;

const MenuBtn = styled.li`
  background-color: ${(props) => `rgba(${props.theme.textRgba}, 0.85)`};
  list-style-type: none;
  color: ${(props) => props.theme.body};
  width: 14rem;
  height: 2.4rem;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.theme.fontmd};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;

  @media (max-width: 40em) {
    width: 10rem;
    height: 2rem;
  }
`;

const MenuItem = motion(styled.li`
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  font-weight: 500;
  cursor: pointer;

  @media (max-width: 40em) {
    flex-direction: column;
    padding: 0.5rem 0;
  }
`);

const LoginWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 40em) {
    padding: 0.5rem 0;
  }
`;

const NavBar = () => {
  const [click, setClick] = useState(true);
  const { scroll } = useLocomotiveScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname !== rootPaths.homeRoot) {
      setClick(false);
      navigate(rootPaths.homeRoot);
      setTimeout(() => {
        const elem = document.querySelector(id);
        if (elem && scroll) {
          scroll.scrollTo(elem, {
            offset: "-100",
            duration: "2000",
            easing: [0.25, 0.0, 0.35, 1.0],
          });
        }
      }, 1000);
    } else {
      const elem = document.querySelector(id);
      if (elem && scroll) {
        scroll.scrollTo(elem, {
          offset: "-100",
          duration: "2000",
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      } else if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <NavContainer
      $click={click}
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, delay: 2.0 }}
    >
      <MenuItems>
        <MenuBtn onClick={() => setClick(!click)}>
          {click ? "Cerrar Menú ▲" : "Menú ▼"}
        </MenuBtn>
        <MenuItem
          onClick={() => handleScroll("#home")}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          Inicio
        </MenuItem>
        <MenuItem
          onClick={() => handleScroll(".about")}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          Nosotros
        </MenuItem>
        <MenuItem
          onClick={() => handleScroll("#shop")}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          Tienda
        </MenuItem>
        <MenuItem
          onClick={() => handleScroll("#new-arrival")}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          Colección
        </MenuItem>
        <MenuItem
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95, y: 0 }}
          style={{ color: "#a9dfd8", fontWeight: 700 }}
        >
          Panel Admin
        </MenuItem>
        <LoginWrapper>
          <CartIcon />
          <LoginButton />
        </LoginWrapper>
      </MenuItems>
    </NavContainer>
  );
};

export default NavBar;
