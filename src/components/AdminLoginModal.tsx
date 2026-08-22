import React, { useState } from 'react';
import { 
  X, Lock, ShieldCheck, AlertCircle, Eye, EyeOff, 
  Sparkles, KeyRound, ArrowRight, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { ADMIN_SECURITY_CREDENTIALS, DatabaseService } from '../data/database';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = DatabaseService.authenticateAdmin(email, password);
      setIsLoading(false);

      if (result.success) {
        setSuccessAnimation(true);
        setTimeout(() => {
          setSuccessAnimation(false);
          onLoginSuccess();
          onClose();
        }, 600);
      } else {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail(ADMIN_SECURITY_CREDENTIALS.email);
    setPassword(ADMIN_SECURITY_CREDENTIALS.password);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="admin-security-login-modal"
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border-4 border-orange-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-950 via-orange-900 to-amber-950 text-white p-6 sm:p-7 border-b-2 border-orange-200/20">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/30 text-amber-200 border border-amber-400/30 text-[10px] font-black uppercase tracking-widest font-mono">
              <Lock className="w-3 h-3 text-amber-300" />
              Restricted Area
            </span>

            <button
              id="close-admin-login-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            Admin Security Login
          </h2>
          <p className="text-xs text-orange-200/80 mt-1 font-medium leading-relaxed">
            Exclusive dashboard access for Chennai Bakery administrators to manage live catalog & orders.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          
          {/* Error Message */}
          {errorMessage && (
            <div 
              id="admin-auth-error-alert"
              className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-950 flex items-start gap-2.5 font-medium animate-in fade-in"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Access Denied</p>
                <p className="text-rose-800 text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successAnimation && (
            <div className="p-3.5 bg-teal-50 border-2 border-teal-200 rounded-2xl text-xs text-teal-950 flex items-center gap-2.5 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>Identity Verified. Opening Admin Dashboard...</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-orange-950 uppercase tracking-wider">
              Administrator Email ID:
            </label>
            <input
              type="email"
              id="admin-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sreerammuthoju86@gmail.com"
              required
              className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-100 focus:border-orange-500 focus:outline-none rounded-2xl text-sm font-medium text-orange-950 transition placeholder-orange-300"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-orange-950 uppercase tracking-wider">
                Admin Password:
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 6-digit password"
                required
                className="w-full px-4 py-3 pr-11 bg-orange-50/50 border-2 border-orange-100 focus:border-orange-500 focus:outline-none rounded-2xl text-sm font-medium text-orange-950 transition placeholder-orange-300 font-mono"
              />
              <button
                type="button"
                id="toggle-admin-password-visibility-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 transition cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="text-amber-950 font-medium">
              <span className="font-bold block text-[11px] text-amber-900">Protected Credentials:</span>
              <span className="text-[10px] text-amber-800/80 font-mono">sreerammuthoju86@gmail.com</span>
            </div>
            <button
              type="button"
              id="quick-fill-admin-credentials-btn"
              onClick={handleQuickFill}
              className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-[10px] uppercase tracking-wider transition cursor-pointer shadow-xs"
            >
              Fill Credentials
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-login-submit-btn"
            disabled={isLoading || successAnimation}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl text-sm shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? (
              <span>Verifying Admin Credentials...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-orange-900/60 text-center font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Strict role security active • Unauthorized access prohibited</span>
          </div>

        </form>
      </div>
    </div>
  );
};
