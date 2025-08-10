import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginBoxProps {
  onLogin: (name: string, isAdmin: boolean) => void;
}

export function LoginBox({ onLogin }: LoginBoxProps) {
  const [name, setName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    const isAdminUser = value === 'Matěj Podhola';
    setShowAdminPassword(isAdminUser);
    if (!isAdminUser) {
      setAdminPassword('');
    }
  };

  const handleLogin = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('Zadejte jméno!');
      return;
    }

    const wantsAdmin = trimmedName === 'Matěj Podhola';
    if (wantsAdmin && adminPassword !== 'Palecek2009') {
      alert('Nesprávné heslo správce!');
      return;
    }

    onLogin(trimmedName, wantsAdmin);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-visiblo-text mb-2">VISIBLO Chat</h1>
        <p className="text-sm sm:text-base text-visiblo-text/70">Profesionální komunikační platforma</p>
      </div>
      
      <Card className="max-w-sm mx-auto border-0 shadow-none bg-transparent">
        <CardContent className="space-y-4 p-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-visiblo-text mb-3 sm:mb-4">
              Uveďte prosím vaše jméno nebo firmu
            </h3>
            <Input 
              type="text"
              placeholder="Např. Jan Novák"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-visiblo-border rounded-xl text-base sm:text-lg transition-all duration-300 focus:border-visiblo-primary-dark focus:bg-visiblo-bg-lighter"
            />
          </div>
          
          {showAdminPassword && (
            <div className="animate-fade-in">
              <Input 
                type="password"
                placeholder="Zadejte heslo správce"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-visiblo-border rounded-xl text-base sm:text-lg transition-all duration-300 focus:border-visiblo-primary-dark focus:bg-visiblo-bg-lighter"
              />
            </div>
          )}
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-visiblo-primary text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-base sm:text-lg shadow-visiblo-button hover:bg-visiblo-primary-dark hover:shadow-visiblo-button-hover transition-all duration-300 transform hover:scale-[1.02]"
          >
            Vstoupit do chatu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
