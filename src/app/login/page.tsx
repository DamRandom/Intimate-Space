'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register } = useAuth();

  // Mode: client or admin
  const defaultRole = (searchParams.get('role') as UserRole) === 'admin' ? 'admin' : 'client';
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Submode for client: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/mi-cuenta');
      }
    }
  }, [user, router]);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (role === 'admin') {
      setAuthMode('login');
      setEmail('');
      setPassword('');
    }
  };

  const fillDemoClient = () => {
    setSelectedRole('client');
    setAuthMode('login');
    setEmail('cliente@espaciointimo.pe');
    setPassword('cliente123');
    setErrorMsg(null);
  };

  const fillDemoAdmin = () => {
    setSelectedRole('admin');
    setAuthMode('login');
    setEmail('admin@espaciointimo.pe');
    setPassword('admin123');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (selectedRole === 'client' && authMode === 'register') {
        const res = register(name, email, phone, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Ocurrió un error al registrar la cuenta.');
          setIsSubmitting(false);
          return;
        }
        setSuccessMsg('¡Bienvenido a Espacio Íntimo! Creando tu credencial de socio...');
        setTimeout(() => {
          router.push('/mi-cuenta');
        }, 1000);
      } else {
        const res = login(email, password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.error || 'Credenciales no válidas.');
          setIsSubmitting(false);
          return;
        }
        setSuccessMsg('Acceso verificado. Redirigiendo a tu espacio privado...');
        setTimeout(() => {
          if (selectedRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/mi-cuenta');
          }
        }, 800);
      }
    } catch {
      setErrorMsg('Error de conexión o validación. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="zen-auth-page-wrapper">
      <Navbar />

      <main className="zen-auth-main-container">
        {/* Subtle decorative glow */}
        <div className="zen-auth-glow-spotlight" />

        <div className="container zen-auth-inner">
          <div className="zen-auth-card">
            {/* Header info */}
            <div className="zen-auth-header">
              <span className="zen-badge-pill">
                <Sparkles size={13} className="text-champagne" />
                Acceso Exclusivo & Confidencial
              </span>
              <h1 className="zen-auth-title">
                {selectedRole === 'client' ? 'Espacio de Socios' : 'Conserjería Central'}
              </h1>
              <p className="zen-auth-subtitle">
                {selectedRole === 'client'
                  ? 'Gestiona tus reservas privadas, preferencias botánicas y citas exclusivas en Miraflores.'
                  : 'Panel confidencial para terapeutas y administración de citas de alta gama.'}
              </p>
            </div>

            {/* Role Dual Switcher */}
            <div className="zen-role-switcher-container">
              <button
                type="button"
                onClick={() => handleRoleChange('client')}
                className={`zen-role-pill-btn ${selectedRole === 'client' ? 'active' : ''}`}
                aria-pressed={selectedRole === 'client'}
              >
                <User size={16} />
                <span>Socio / Huésped</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`zen-role-pill-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                aria-pressed={selectedRole === 'admin'}
              >
                <Crown size={16} />
                <span>Conserjería & Admin</span>
              </button>
            </div>

            {/* Sub-tabs for Client: Login vs Register */}
            {selectedRole === 'client' && (
              <div className="zen-subtab-container">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
                  className={`zen-subtab-btn ${authMode === 'login' ? 'active' : ''}`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
                  className={`zen-subtab-btn ${authMode === 'register' ? 'active' : ''}`}
                >
                  Registrarme como Socio
                </button>
              </div>
            )}

            {/* Notification messages */}
            {errorMsg && (
              <div className="zen-auth-alert error">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="zen-auth-alert success">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="zen-auth-form">
              {/* If registering client, ask for Name and Phone */}
              {selectedRole === 'client' && authMode === 'register' && (
                <>
                  <div className="zen-input-group">
                    <label htmlFor="auth-name" className="zen-input-label">
                      Nombre Completo o Alias de Confianza
                    </label>
                    <div className="zen-input-wrapper">
                      <User size={18} className="zen-input-icon" />
                      <input
                        id="auth-name"
                        type="text"
                        required
                        placeholder="Ej: Sebastián Valdivia"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="zen-auth-input"
                      />
                    </div>
                  </div>

                  <div className="zen-input-group">
                    <label htmlFor="auth-phone" className="zen-input-label">
                      WhatsApp / Móvil (Para confirmación privada)
                    </label>
                    <div className="zen-input-wrapper">
                      <Phone size={18} className="zen-input-icon" />
                      <input
                        id="auth-phone"
                        type="tel"
                        required
                        placeholder="+51 987 654 321"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="zen-auth-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="zen-input-group">
                <label htmlFor="auth-email" className="zen-input-label">
                  {selectedRole === 'admin' ? 'Correo Administrativo' : 'Correo Electrónico'}
                </label>
                <div className="zen-input-wrapper">
                  <Mail size={18} className="zen-input-icon" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder={
                      selectedRole === 'admin' ? 'admin@espaciointimo.pe' : 'tu-correo@ejemplo.com'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="zen-auth-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="zen-input-group">
                <div className="zen-label-with-hint">
                  <label htmlFor="auth-password" className="zen-input-label">
                    Contraseña
                  </label>
                  {selectedRole === 'client' && authMode === 'login' && (
                    <span className="zen-input-hint">Mínimo 6 caracteres</span>
                  )}
                </div>
                <div className="zen-input-wrapper">
                  <Lock size={18} className="zen-input-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="zen-auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="zen-input-action-btn"
                    aria-label="Ver u ocultar contraseña"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-zen-filled zen-auth-submit-btn"
              >
                <span>
                  {isSubmitting
                    ? 'Procesando...'
                    : selectedRole === 'admin'
                    ? 'Acceder a Conserjería'
                    : authMode === 'register'
                    ? 'Crear Cuenta Exclusiva'
                    : 'Ingresar a mi Espacio'}
                </span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="zen-demo-credentials-card">
              <div className="zen-demo-header">
                <ShieldCheck size={16} className="text-champagne" />
                <span>Acceso Rápido de Prueba (1-Click Demo)</span>
              </div>
              <p className="zen-demo-desc">
                Explora el sistema con las cuentas preconfiguradas con datos de muestra:
              </p>
              <div className="zen-demo-buttons-row">
                <button
                  type="button"
                  onClick={fillDemoClient}
                  className="zen-demo-pill-btn"
                >
                  <User size={14} />
                  <span>Cargar Cliente Demo (Sebastián)</span>
                </button>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="zen-demo-pill-btn gold"
                >
                  <Crown size={14} />
                  <span>Cargar Admin Demo (Concierge)</span>
                </button>
              </div>
            </div>

            {/* Footer note */}
            <div className="zen-auth-footer-privacy">
              <p>
                Al acceder aceptas nuestras políticas de máxima discreción, confidencialidad y
                reserva protegida en Miraflores, Lima.
              </p>
              <Link href="/" className="zen-back-home-link">
                ← Volver a la portada principal
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="zen-loading-screen">Cargando acceso seguro...</div>}>
      <LoginContent />
    </Suspense>
  );
}
