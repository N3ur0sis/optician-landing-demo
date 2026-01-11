'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Identifiants invalides');
        setIsLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('Une erreur s\'est produite');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo Area */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Accès Administrateur</h1>
          <p className="text-sm text-gray-500">Connectez-vous à votre compte</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
                placeholder="admin@exemple.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-gray-500 text-xs mt-8"
        >
          Système d'authentification sécurisé
        </motion.p>
      </motion.div>
    </div>
  );
}
