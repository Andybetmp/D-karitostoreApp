import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../routes/paths';
import { SignIn1 } from './ui/modern-stunning-sign-in';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled(motion.div)`
  width: 92%;
  max-width: 420px;
  position: relative;
`;

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
        >
          <ModalWrapper
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SignIn1
              isModal={true}
              onClose={closeLoginModal}
              onSuccess={() => {
                closeLoginModal();
                navigate(rootPaths.dashboard);
              }}
            />
          </ModalWrapper>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
