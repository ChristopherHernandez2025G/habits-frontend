"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    const url = isRegister
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isRegister) {
          // LOGIN
          localStorage.setItem("token", data.token);
          alert("Login exitoso");
          router.push("/");
        } else {
          // REGISTER
          alert("Usuario registrado correctamente");
          setIsRegister(false);
        }
      } else {
        alert(data.message || "Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {isRegister ? "Crear cuenta" : "Login"}
        </h1>

        <input
          type="text"
          placeholder="Usuario"
          className="w-full mb-4 p-2 border rounded text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          {isRegister ? "Registrarse" : "Iniciar sesión"}
        </button>

        <p className="text-center text-black">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
        </p>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-2 text-blue-500 underline"
        >
          {isRegister ? "Ir a Login" : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
}