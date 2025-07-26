import { useState, useEffect } from "react";
import { PremiumButton } from "@/components/ui/premium-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Clock,
  Star,
  CheckCircle,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar_url: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  professional_id: string;
}

export default function LandingPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    notes: ""
  });
  
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load professionals and services
  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      loadServices(selectedProfessional);
    }
  }, [selectedProfessional]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error loading professionals:', error);
    }
  };

  const loadServices = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: authData.name,
              phone: authData.phone
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Conta criada com sucesso! ✅",
          description: "Você já pode continuar com o agendamento.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        });
        
        if (error) throw error;
        
        toast({
          title: "Login realizado com sucesso! ✅",
          description: "Bem-vindo de volta!",
        });
      }
      
      setBookingStep(2);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!currentUser || !selectedProfessional || !selectedService) return;
    
    setLoading(true);
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();
      
      if (!profile) throw new Error('Profile not found');
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          client_id: profile.id,
          professional_id: selectedProfessional,
          service_id: selectedService,
          appointment_date: bookingData.date,
          appointment_time: bookingData.time,
          notes: bookingData.notes
        });
      
      if (error) throw error;
      
      toast({
        title: "Agendamento Confirmado! ✅",
        description: "Seu agendamento foi realizado com sucesso!",
      });
      
      // Reset form
      setShowBooking(false);
      setBookingStep(1);
      setSelectedProfessional(null);
      setSelectedService(null);
      setBookingData({ date: "", time: "", notes: "" });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  if (showBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="card-premium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Agendar Horário</CardTitle>
                  <p className="text-muted-foreground">
                    {!isAuthenticated ? "Login/Cadastro" : `Passo ${bookingStep - 1} de 4`}
                  </p>
                </div>
                <PremiumButton 
                  variant="ghost" 
                  onClick={() => setShowBooking(false)}
                >
                  ✕ Fechar
                </PremiumButton>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Authentication */}
              {bookingStep === 1 && !isAuthenticated && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {isSignUp ? "Criar Conta" : "Fazer Login"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isSignUp ? "Crie sua conta para agendar" : "Entre com sua conta"}
                    </p>
                  </div>
                  
                  {isSignUp && (
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={authData.name}
                        onChange={(e) => setAuthData({...authData, name: e.target.value})}
                        placeholder="Seu nome"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={authData.email}
                      onChange={(e) => setAuthData({...authData, email: e.target.value})}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  {isSignUp && (
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={authData.phone}
                        onChange={(e) => setAuthData({...authData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authData.password}
                      onChange={(e) => setAuthData({...authData, password: e.target.value})}
                      placeholder="Sua senha"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <PremiumButton 
                      variant="premium" 
                      className="w-full" 
                      onClick={handleAuth}
                      disabled={loading || !authData.email || !authData.password || (isSignUp && (!authData.name || !authData.phone))}
                    >
                      {loading ? "Aguarde..." : (isSignUp ? "Criar Conta" : "Entrar")}
                    </PremiumButton>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline text-sm"
                      >
                        {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Criar agora"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select Professional */}
              {(bookingStep === 2 || (bookingStep === 1 && isAuthenticated)) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Escolha o Profissional</h3>
                  <div className="grid gap-4">
                    {professionals.map((prof) => (
                      <div
                        key={prof.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedProfessional === prof.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedProfessional(prof.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <img 
                            src={prof.avatar_url} 
                            alt={prof.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{prof.name}</h4>
                            <p className="text-sm text-muted-foreground">{prof.specialty}</p>
                          </div>
                          {selectedProfessional === prof.id && (
                            <CheckCircle className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <PremiumButton 
                    variant="premium" 
                    className="w-full" 
                    onClick={() => setBookingStep(3)}
                    disabled={!selectedProfessional}
                  >
                    Próximo Passo
                  </PremiumButton>
                </div>
              )}

              {/* Step 3: Select Service */}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Escolha o Serviço</h3>
                  <div className="grid gap-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <p className="text-xs text-muted-foreground">{service.duration} min</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">R$ {service.price.toFixed(2)}</p>
                            {selectedService === service.id && (
                              <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <PremiumButton 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => setBookingStep(2)}
                    >
                      Voltar
                    </PremiumButton>
                    <PremiumButton 
                      variant="premium" 
                      className="flex-1" 
                      onClick={() => setBookingStep(4)}
                      disabled={!selectedService}
                    >
                      Próximo Passo
                    </PremiumButton>
                  </div>
                </div>
              )}

              {/* Step 4: Date and Time */}
              {bookingStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data e Horário</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <select
                        id="time"
                        className="w-full p-2 border border-border rounded-md"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      >
                        <option value="">Selecione um horário</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="Alguma observação especial?"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <PremiumButton 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => setBookingStep(3)}
                    >
                      Voltar
                    </PremiumButton>
                    <PremiumButton 
                      variant="hero" 
                      className="flex-1" 
                      onClick={handleBookingSubmit}
                      disabled={loading || !bookingData.date || !bookingData.time}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {loading ? "Agendando..." : "Confirmar Agendamento"}
                    </PremiumButton>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Sistema Profissional de Agendamento
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              Agende com Facilidade
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Sistema moderno e intuitivo para agendamentos. Escolha seu profissional, 
              selecione o horário ideal e confirme em segundos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <PremiumButton 
              variant="hero" 
              size="xl"
              onClick={() => setShowBooking(true)}
              className="group"
            >
              <Calendar className="h-6 w-6 mr-3" />
              Agendar Agora
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </PremiumButton>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rápido e Simples</h3>
              <p className="text-muted-foreground">
                Agendamento em poucos cliques, sem complicação
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
              <p className="text-muted-foreground">
                Seus dados protegidos com tecnologia de ponta
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Confirmação Instantânea</h3>
              <p className="text-muted-foreground">
                Receba confirmação imediata do seu agendamento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Agendar?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o melhor horário para você e confirme seu agendamento
          </p>
          <PremiumButton 
            variant="premium" 
            size="lg"
            onClick={() => setShowBooking(true)}
          >
            <User className="h-5 w-5 mr-2" />
            Começar Agendamento
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}