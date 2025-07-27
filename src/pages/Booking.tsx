import { useState } from "react";
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

// Mock data - será conectado ao Supabase
const mockProfessionals = [
  {
    id: 1,
    name: "Maria Silva",
    specialties: ["Cabelo", "Escova", "Corte"],
    rating: 4.9,
    image: "/placeholder.svg",
    available: true
  },
  {
    id: 2,
    name: "João Santos",
    specialties: ["Barba", "Corte Masculino", "Bigode"],
    rating: 4.8,
    image: "/placeholder.svg",
    available: true
  },
  {
    id: 3,
    name: "Ana Costa",
    specialties: ["Coloração", "Luzes", "Tratamentos"],
    rating: 5.0,
    image: "/placeholder.svg",
    available: true
  }
];

const mockServices = [
  { id: 1, name: "Corte Feminino", duration: 60, price: "R$ 45", professionalId: 1 },
  { id: 2, name: "Escova", duration: 45, price: "R$ 35", professionalId: 1 },
  { id: 3, name: "Corte Masculino", duration: 30, price: "R$ 25", professionalId: 2 },
  { id: 4, name: "Barba", duration: 20, price: "R$ 15", professionalId: 2 },
  { id: 5, name: "Coloração", duration: 120, price: "R$ 80", professionalId: 3 },
  { id: 6, name: "Luzes", duration: 180, price: "R$ 120", professionalId: 3 }
];

const mockTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

type Step = 'welcome' | 'login' | 'professionals' | 'services' | 'datetime' | 'notes' | 'confirmation' | 'myBookings';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface BookingData {
  professional?: typeof mockProfessionals[0];
  service?: typeof mockServices[0];
  date?: Date;
  time?: string;
  notes?: string;
}

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [loginForm, setLoginForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

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
        <h2 className="text-2xl font-bold">Entre ou Cadastre-se</h2>
        <p className="text-muted-foreground">Para continuar com seu agendamento</p>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={loginForm.name}
              onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
              placeholder="Seu nome completo"
            />
          </div>
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
          <div>
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              value={loginForm.phone}
              onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
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
            onClick={() => {
              setUser({ name: loginForm.name, email: loginForm.email, phone: loginForm.phone });
              setCurrentStep('professionals');
            }}
            disabled={!loginForm.name || !loginForm.email || !loginForm.phone || !loginForm.password}
          >
            Continuar
          </Button>
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
        {mockProfessionals.map((professional) => (
          <Card 
            key={professional.id} 
            className="card-premium cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => {
              setBookingData({...bookingData, professional});
              setCurrentStep('services');
            }}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{professional.name}</h3>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{professional.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {professional.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
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
  const ServicesStep = () => {
    const availableServices = mockServices.filter(
      service => service.professionalId === bookingData.professional?.id
    );

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Escolha o Serviço</h2>
          <p className="text-muted-foreground">
            Serviços disponíveis com {bookingData.professional?.name}
          </p>
        </div>

        <div className="grid gap-4">
          {availableServices.map((service) => (
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
                    <p className="text-sm text-muted-foreground">
                      Duração: {service.duration} minutos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
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
  };

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
              onClick={() => setCurrentStep('confirmation')}
            >
              Finalizar Agendamento
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentStep('confirmation')}
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
              <p><strong>Preço:</strong> {bookingData.service?.price}</p>
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

  // My Bookings Step
  const MyBookingsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Meus Agendamentos</h2>
        <p className="text-muted-foreground">Gerencie seus horários marcados</p>
      </div>

      <div className="grid gap-4">
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Próximos Agendamentos</span>
              <Badge className="bg-primary text-primary-foreground">Ativo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{bookingData.service?.name}</h4>
                <span className="text-sm text-muted-foreground">{bookingData.service?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Com {bookingData.professional?.name}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {bookingData.date && format(bookingData.date, "dd/MM/yyyy")}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {bookingData.time}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Nenhum agendamento anterior encontrado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline"
          onClick={() => {
            setCurrentStep('welcome');
            setBookingData({});
            setSelectedDate(undefined);
          }}
        >
          Novo Agendamento
        </Button>
      </div>
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
                           currentStep === 'datetime' ? '80%' : '100%'
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