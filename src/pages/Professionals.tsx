import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Phone, 
  Mail,
  Star,
  Edit,
  Trash2,
  Calendar,
  DollarSign
} from "lucide-react";

const mockProfessionals = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-1111",
    specialty: "Barbeiro Especialista",
    rating: 4.9,
    totalAppointments: 156,
    monthlyRevenue: "R$ 3,200",
    status: "active",
    workingHours: "08:00 - 18:00",
    commission: "60%"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 99999-2222",
    specialty: "Cabeleireira Senior",
    rating: 4.8,
    totalAppointments: 189,
    monthlyRevenue: "R$ 4,100",
    status: "active",
    workingHours: "09:00 - 17:00",
    commission: "65%"
  },
  {
    id: 3,
    name: "Carlos Pereira",
    email: "carlos@email.com",
    phone: "(11) 99999-3333",
    specialty: "Barbeiro & Estilista",
    rating: 4.9,
    totalAppointments: 134,
    monthlyRevenue: "R$ 2,800",
    status: "active",
    workingHours: "10:00 - 19:00",
    commission: "60%"
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 99999-4444",
    specialty: "Colorista",
    rating: 4.7,
    totalAppointments: 98,
    monthlyRevenue: "R$ 2,300",
    status: "inactive",
    workingHours: "08:00 - 16:00",
    commission: "55%"
  },
];

export default function Professionals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState(mockProfessionals);

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: number) => {
    setProfessionals(prev =>
      prev.map(prof =>
        prof.id === id
          ? { ...prof, status: prof.status === "active" ? "inactive" : "active" }
          : prof
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profissionais</h1>
            <p className="text-muted-foreground">Gerencie sua equipe de profissionais</p>
          </div>
          <PremiumButton variant="premium">
            <Plus className="h-4 w-4 mr-2" />
            Novo Profissional
          </PremiumButton>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="card-premium lg:col-span-2">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar profissional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{professionals.filter(p => p.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">R$ 12.4k</p>
              <p className="text-sm text-muted-foreground">Faturamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Professionals Grid */}
        <div className="grid gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {professional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{professional.name}</h3>
                        <Badge variant={professional.status === "active" ? "default" : "secondary"}>
                          {professional.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      
                      <p className="text-primary font-medium mb-2">{professional.specialty}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {professional.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {professional.phone}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                          {professional.rating} avaliação
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {professional.workingHours}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right space-y-1">
                      <div>
                        <p className="text-sm text-muted-foreground">Faturamento/mês</p>
                        <p className="text-xl font-bold text-primary">{professional.monthlyRevenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agendamentos</p>
                        <p className="text-lg font-semibold">{professional.totalAppointments}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Comissão</p>
                        <p className="text-lg font-semibold">{professional.commission}</p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={professional.status === "active"}
                          onCheckedChange={() => toggleStatus(professional.id)}
                        />
                        <span className="text-sm">
                          {professional.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <PremiumButton size="sm" variant="outline" title="Editar">
                          <Edit className="h-4 w-4" />
                        </PremiumButton>
                        <PremiumButton size="sm" variant="outline" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </PremiumButton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Esta semana</p>
                      <p className="font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">agendamentos</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avaliação média</p>
                      <p className="font-bold text-primary">{professional.rating}</p>
                      <p className="text-xs text-muted-foreground">últimos 30 dias</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Próximo</p>
                      <p className="font-bold">14:30</p>
                      <p className="text-xs text-muted-foreground">hoje</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Taxa ocupação</p>
                      <p className="font-bold text-primary">85%</p>
                      <p className="text-xs text-muted-foreground">este mês</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum profissional encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar o termo de busca ou adicione um novo profissional.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}