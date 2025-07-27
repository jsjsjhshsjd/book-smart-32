import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone,
  CheckCircle,
  ArrowLeft,
  Star,
  MapPin,
  Scissors,
  Heart
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar_url: string;
  is_active: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  professional_id: string;
}

interface BookingData {
  professional?: Professional;
  service?: Service;
  date?: Date;
  time?: string;
  notes?: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
}

const mockTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

type Step = 'welcome' | 'login' | 'professionals' | 'services' | 'datetime' | 'notes' | 'confirmation' | 'myBookings';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [loginForm, setLoginForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user || null);
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email || '',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || ''
        });
        setCurrentStep('professionals');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setCurrentUser(session?.user || null);
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email || '',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || ''
        });
        setCurrentStep('professionals');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load professionals
  useEffect(() => {
    loadProfessionals();
  }, []);

  // Load services when professional is selected
  useEffect(() => {
    if (bookingData.professional) {
      loadServices(bookingData.professional.id);
    }
  }, [bookingData.professional]);

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
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive"
      });
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
      toast({
        title: "Erro",
        description: "Erro ao carregar serviços",
        variant: "destructive"
      });
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: loginForm.email,
          password: loginForm.password,
          options: {
            emailRedirectTo: `${window.location.origin}/booking`,
            data: {
              name: loginForm.name,
              phone: loginForm.phone
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
          email: loginForm.email,
          password: loginForm.password
        });
        
        if (error) throw error;
        
        toast({
          title: "Login realizado com sucesso! ✅",
          description: "Bem-vindo de volta!",
        });
      }
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
    if (!currentUser || !bookingData.professional || !bookingData.service || !bookingData.date || !bookingData.time) return;
    
    setLoading(true);
    try {
      // Get or create user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();
      
      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: currentUser.id,
            name: user?.name || currentUser.email || '',
            email: currentUser.email || '',
            phone: user?.phone || ''
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        profile = newProfile;
      }
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          client_id: profile.id,
          professional_id: bookingData.professional.id,
          service_id: bookingData.service.id,
          appointment_date: format(bookingData.date, "yyyy-MM-dd"),
          appointment_time: bookingData.time,
          notes: bookingData.notes || null
        });
      
      if (error) throw error;
      
      toast({
        title: "Agendamento Confirmado! ✅",
        description: "Seu agendamento foi realizado com sucesso!",
      });
      
      setCurrentStep('confirmation');
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

  // Welcome Step
  const WelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto">
          <Scissors className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Agende seu Horário
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Encontre o profissional perfeito e agende seu serviço de forma rápida e segura
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <Card className="card-premium border-primary/20">
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Profissionais Qualificados</h3>
            <p className="text-sm text-muted-foreground">Equipe especializada e avaliada</p>
          </CardContent>
        </Card>
        <Card className="card-premium border-primary/20">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Horários Flexíveis</h3>
            <p className="text-sm text-muted-foreground">Escolha o melhor horário para você</p>
          </CardContent>
        </Card>
        <Card className="card-premium border-primary/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Experiência Única</h3>
            <p className="text-sm text-muted-foreground">Atendimento personalizado</p>
          </CardContent>
        </Card>
      </div>

      <Button 
        size="lg" 
        className="btn-premium text-lg px-12 py-6 h-auto"
        onClick={() => setCurrentStep('login')}
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        Agendar Agora
      </Button>
    </div>
  );

  // Login Step
  const LoginStep = () => (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{isSignUp ? "Criar Conta" : "Entre ou Cadastre-se"}</h2>
        <p className="text-muted-foreground">Para continuar com seu agendamento</p>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6 space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={loginForm.name}
                onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              placeholder="seu@email.com"
            />
          </div>
          {isSignUp && (
            <div>
              <Label htmlFor="phone">WhatsApp</Label>
              <Input
                id="phone"
                value={loginForm.phone}
                onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
          )}
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="Sua senha"
            />
          </div>
          <Button 
            className="w-full btn-premium"
            onClick={handleAuth}
            disabled={loading || !loginForm.email || !loginForm.password || (isSignUp && (!loginForm.name || !loginForm.phone))}
          >
            {loading ? "Aguarde..." : (isSignUp ? "Criar Conta" : "Entrar")}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline text-sm"
            >
              {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Criar agora"}
            </button>
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => setCurrentStep('welcome')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
    </div>
  );

  // Professionals Step
  const ProfessionalsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha seu Profissional</h2>
        <p className="text-muted-foreground">Selecione o profissional de sua preferência</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <Card 
            key={professional.id} 
            className="card-premium cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => {
              setBookingData({...bookingData, professional});
              setCurrentStep('services');
            }}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
                <img 
                  src={professional.avatar_url} 
                  alt={professional.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{professional.name}</h3>
                <p className="text-sm text-muted-foreground">{professional.specialty}</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                Disponível
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => setCurrentStep('login')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );

  // Services Step
  const ServicesStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha o Serviço</h2>
        <p className="text-muted-foreground">
          Serviços disponíveis com {bookingData.professional?.name}
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card 
            key={service.id}
            className="card-premium cursor-pointer hover:border-primary transition-all"
            onClick={() => {
              setBookingData({...bookingData, service});
              setCurrentStep('datetime');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <p className="text-xs text-muted-foreground">Duração: {service.duration} minutos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">R$ {service.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => setCurrentStep('professionals')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );

  // DateTime Step
  const DateTimeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha Data e Horário</h2>
        <p className="text-muted-foreground">Selecione o melhor dia e horário</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-center">Selecione a Data</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setBookingData({...bookingData, date});
              }}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              locale={ptBR}
              className="pointer-events-auto"
            />
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-center">Horários Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-3">
                {mockTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={bookingData.time === time ? "default" : "outline"}
                    onClick={() => {
                      setBookingData({...bookingData, time});
                      setCurrentStep('notes');
                    }}
                    className="h-12"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Selecione uma data para ver os horários disponíveis
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => setCurrentStep('services')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );

  // Notes Step
  const NotesStep = () => (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Observações</h2>
        <p className="text-muted-foreground">Alguma informação adicional? (Opcional)</p>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Prefiro corte mais curto, tenho alergia a produtos específicos..."
              value={bookingData.notes || ''}
              onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full btn-premium"
              onClick={handleBookingSubmit}
              disabled={loading}
            >
              {loading ? "Agendando..." : "Finalizar Agendamento"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleBookingSubmit}
              disabled={loading}
            >
              Pular e Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => setCurrentStep('datetime')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );

  // Confirmation Step
  const ConfirmationStep = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-success to-success/60 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-success">Agendamento Confirmado!</h2>
        <p className="text-muted-foreground">Seu horário foi marcado com sucesso</p>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Detalhes do Agendamento</h3>
            <div className="text-left space-y-2 text-sm">
              <p><strong>Profissional:</strong> {bookingData.professional?.name}</p>
              <p><strong>Serviço:</strong> {bookingData.service?.name}</p>
              <p><strong>Data:</strong> {bookingData.date && format(bookingData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
              <p><strong>Horário:</strong> {bookingData.time}</p>
              <p><strong>Preço:</strong> R$ {bookingData.service?.price.toFixed(2)}</p>
              {bookingData.notes && <p><strong>Observações:</strong> {bookingData.notes}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full btn-premium"
          onClick={() => setCurrentStep('myBookings')}
        >
          Ver Meus Agendamentos
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setCurrentStep('welcome');
            setBookingData({});
            setSelectedDate(undefined);
          }}
        >
          Fazer Novo Agendamento
        </Button>
      </div>
    </div>
  );

  // My Bookings Step - placeholder for now
  const MyBookingsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Meus Agendamentos</h2>
        <p className="text-muted-foreground">Gerencie seus horários marcados</p>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Funcionalidade em desenvolvimento. Seus agendamentos aparecerão aqui em breve.
          </p>
          <Button 
            className="mt-4"
            onClick={() => {
              setCurrentStep('welcome');
              setBookingData({});
              setSelectedDate(undefined);
            }}
          >
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return <WelcomeStep />;
      case 'login': return <LoginStep />;
      case 'professionals': return <ProfessionalsStep />;
      case 'services': return <ServicesStep />;
      case 'datetime': return <DateTimeStep />;
      case 'notes': return <NotesStep />;
      case 'confirmation': return <ConfirmationStep />;
      case 'myBookings': return <MyBookingsStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep !== 'welcome' && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-16 h-1 bg-primary/20 rounded-full">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{
                    width: currentStep === 'login' ? '20%' : 
                           currentStep === 'professionals' ? '40%' :
                           currentStep === 'services' ? '60%' :
                           currentStep === 'datetime' || currentStep === 'notes' ? '80%' : '100%'
                  }}></div>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary/20"></div>
              </div>
              {user && (
                <p className="text-center text-sm text-muted-foreground">
                  Olá, {user.name}! 👋
                </p>
              )}
            </div>
          )}
          
          <div className="animate-fade-in">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}