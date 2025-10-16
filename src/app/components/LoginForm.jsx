// src/components/LoginForm.js
"use client"
import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';


const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error al iniciar sesión:', error);
        setError(error.message);
        setLoading(false);
      } else {
        console.log('Login exitoso:', data);
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al iniciar sesión');
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-6">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;