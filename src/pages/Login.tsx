import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (userType: 'admin' | 'client') => {
    // Simulate login
    toast({
      title: "Login realizado com sucesso! ✅",
      description: `Bem-vindo${userType === 'admin' ? ' ao painel administrativo' : ''}!`,
    });
    
    if (userType === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="card-premium shadow-[var(--shadow-premium)]">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">AgendaPlus</CardTitle>
            <p className="text-muted-foreground">Sistema de Agendamento Profissional</p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="admin">Administrador</TabsTrigger>
                <TabsTrigger value="client">Cliente</TabsTrigger>
              </TabsList>
              
              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="admin-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <PremiumButton 
                    variant="premium" 
                    className="w-full" 
                    onClick={() => handleLogin('admin')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Entrar como Admin
                  </PremiumButton>
                  
                  <div className="text-center">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              {/* Client Login/Register */}
              <TabsContent value="client" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="client-name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="client-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <PremiumButton 
                    variant="premium" 
                    className="w-full" 
                    onClick={() => handleLogin('client')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar/Cadastrar
                  </PremiumButton>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Ao continuar, você concorda com nossos{" "}
                      <a href="#" className="text-primary hover:underline">Termos de Uso</a>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">🚀 Demo - Credenciais para teste:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Admin:</strong> admin@demo.com / demo123</p>
                <p><strong>Cliente:</strong> qualquer nome e email</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <PremiumButton 
            variant="glass" 
            onClick={() => navigate('/')}
            className="text-white"
          >
            ← Voltar para o site
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}