import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  User, 
  Phone,
  CheckCircle,
  XCircle,
  Edit
} from "lucide-react";

const mockAppointments = [
  {
    id: 1,
    client: "Maria Silva",
    phone: "(11) 99999-1111",
    service: "Corte + Escova",
    professional: "João",
    date: "2024-01-15",
    time: "14:00",
    status: "confirmed",
    price: "R$ 60"
  },
  {
    id: 2,
    client: "Pedro Santos",
    phone: "(11) 99999-2222",
    service: "Barba",
    professional: "Carlos",
    date: "2024-01-15",
    time: "14:30",
    status: "pending",
    price: "R$ 15"
  },
  {
    id: 3,
    client: "Ana Costa",
    phone: "(11) 99999-3333",
    service: "Coloração",
    professional: "Maria",
    date: "2024-01-15",
    time: "15:00",
    status: "completed",
    price: "R$ 80"
  },
  {
    id: 4,
    client: "Lucas Oliveira",
    phone: "(11) 99999-4444",
    service: "Corte Masculino",
    professional: "João",
    date: "2024-01-16",
    time: "09:00",
    status: "confirmed",
    price: "R$ 25"
  },
];

const statusConfig = {
  pending: { label: "Pendente", color: "bg-warning text-warning-foreground" },
  confirmed: { label: "Confirmado", color: "bg-primary text-primary-foreground" },
  completed: { label: "Finalizado", color: "bg-success text-success-foreground" },
  cancelled: { label: "Cancelado", color: "bg-destructive text-destructive-foreground" },
};

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState(mockAppointments);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.professional.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || appointment.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const updateStatus = (id: number, newStatus: string) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os agendamentos</p>
          </div>
          <PremiumButton variant="premium">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </PremiumButton>
        </div>

        {/* Filters */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Cliente, serviço ou profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <PremiumButton variant="outline" className="w-full">
                  Filtros Avançados
                </PremiumButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.client}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {appointment.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{appointment.service}</p>
                      <p className="text-sm text-muted-foreground">com {appointment.professional}</p>
                      <p className="text-lg font-bold text-primary">{appointment.price}</p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                      <Badge className={statusConfig[appointment.status as keyof typeof statusConfig].color}>
                        {statusConfig[appointment.status as keyof typeof statusConfig].label}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        {appointment.status === "pending" && (
                          <>
                            <PremiumButton
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(appointment.id, "confirmed")}
                              title="Confirmar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </PremiumButton>
                            <PremiumButton
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(appointment.id, "cancelled")}
                              title="Cancelar"
                            >
                              <XCircle className="h-4 w-4" />
                            </PremiumButton>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <PremiumButton
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(appointment.id, "completed")}
                            title="Finalizar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </PremiumButton>
                        )}
                        <PremiumButton
                          size="sm"
                          variant="ghost"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </PremiumButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou criar um novo agendamento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}