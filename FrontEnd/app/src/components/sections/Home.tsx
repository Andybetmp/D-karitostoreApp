import React from "react";
import styled from "styled-components";
import CoverVideo from "../CoverVideo";
import NavBar from "../NavBar";
import Logo from "../Logo";

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${(props) => props.theme.body};
`;

const Home = () => {
  return (
    <Section id="home">
      <Logo />
      <NavBar />
      <CoverVideo />
    </Section>
  );
};

export default Home;
