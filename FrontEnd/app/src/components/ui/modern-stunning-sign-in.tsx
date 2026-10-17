"use client";

import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { rootPaths } from "../../routes/paths";
import dkaritoStarLogo from "../../assets/Svgs/star_white_48dp.svg";
import dkaritoFullLogo from "../../assets/Logo-with-text.png";

interface SignIn1Props {
  isModal?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

const SignIn1: React.FC<SignIn1Props> = ({ isModal = false, onSuccess, onClose }) => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("admin@dkarito.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }
    setError("");
    if (authError) clearError();

    try {
      await login({
        email: email.trim(),
        password,
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(rootPaths.dashboard);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Credenciales inválidas.";
      setError(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    if (authError) clearError();
    await loginWithGoogle({});
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(rootPaths.dashboard);
    }
  };

  return (
    <div
      className={`dk-erp-root ${
        isModal ? "py-6 px-4 rounded-3xl" : "min-h-screen w-full"
      } flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden`}
    >
      {/* D'Karito Logo Background Watermark */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          src={dkaritoStarLogo}
          alt=""
          aria-hidden="true"
          className="w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] object-contain opacity-[0.06] scale-110"
        />
        <img
          src={dkaritoFullLogo}
          alt=""
          aria-hidden="true"
          className="absolute bottom-8 right-8 w-48 object-contain opacity-[0.08] hidden sm:block"
        />
      </div>

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center border border-white/10">
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        )}

        {/* D'Karito Logo */}
        <div
          onClick={() => navigate("/")}
          title="Volver a la tienda D'Karito Store"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/15 mb-5 shadow-lg cursor-pointer hover:bg-white/25 transition p-2.5 border border-white/20"
        >
          <img
            src={dkaritoStarLogo}
            alt="D'Karito Store Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center tracking-tight">
          D&apos;Karito Store
        </h2>

        {/* Form */}
        <form onSubmit={handleSignIn} className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
            {(error || authError) && (
              <div className="text-sm text-red-400 text-left">
                {error || authError}
              </div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm disabled:opacity-50"
            >
              {isLoading ? "Iniciando sesión..." : "Sign in"}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="w-full text-center mt-2 flex flex-col gap-1.5">
              <span className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <a
                  href="/authentication/sign-up"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClose) onClose();
                    navigate("/authentication/sign-up");
                  }}
                  className="underline text-white/80 hover:text-white"
                >
                  Sign up, it&apos;s free!
                </a>
              </span>
              {!isModal && (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-xs text-gray-400 hover:text-white transition mt-1"
                >
                  ← Volver a la tienda
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* User count and avatars */}
      {!isModal && (
        <div className="relative z-10 mt-12 flex flex-col items-center text-center">
          <p className="text-gray-400 text-sm mb-2">
            Join <span className="font-medium text-white">thousands</span> of
            customers who are already using D&apos;Karito Store.
          </p>
          <div className="flex -space-x-1">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { SignIn1 };
export default SignIn1;
