import React, { useState } from 'react';
import { Save, Lock } from 'lucide-react';

const KelolaAkun = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru dan konfirmasi tidak cocok');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      return;
    }
    // In a real app, verify oldPassword here
    
    setPasswordError('');
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Keamanan & Password</h1>
      </div>

      <div className="max-w-xl">
        {/* Password Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} className="text-[#2D5A27] dark:text-green-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ganti Password Admin</h2>
          </div>
          
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Password Lama</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded focus:ring-[#2D5A27] focus:border-[#2D5A27]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Password Baru</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-755 bg-white dark:bg-gray-800 dark:text-white rounded focus:ring-[#2D5A27] focus:border-[#2D5A27]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Konfirmasi Password Baru</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-755 bg-white dark:bg-gray-800 dark:text-white rounded focus:ring-[#2D5A27] focus:border-[#2D5A27]"
                required
              />
            </div>
            
            {passwordError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 p-2 rounded">{passwordError}</p>
            )}
            
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-[#2D5A27] hover:bg-green-750 text-white px-4 py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={18} /> Ganti Password
              </button>
            </div>
            {passwordSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 p-2 rounded text-center">Password berhasil diperbarui!</p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default KelolaAkun;
