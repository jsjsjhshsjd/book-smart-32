import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail,
  Calendar,
  Star,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const mockClients = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-1111",
    lastVisit: "2024-01-10",
    totalAppointments: 15,
    totalSpent: "R$ 890",
    rating: 4.9,
    status: "active"
  },
  {
    id: 2,
    name: "Pedro Santos",
    email: "pedro@email.com",
    phone: "(11) 99999-2222",
    lastVisit: "2024-01-08",
    totalAppointments: 8,
    totalSpent: "R$ 320",
    rating: 4.7,
    status: "active"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 99999-3333",
    lastVisit: "2024-01-05",
    totalAppointments: 22,
    totalSpent: "R$ 1,540",
    rating: 5.0,
    status: "vip"
  },
  {
    id: 4,
    name: "Lucas Oliveira",
    email: "lucas@email.com",
    phone: "(11) 99999-4444",
    lastVisit: "2023-12-15",
    totalAppointments: 3,
    totalSpent: "R$ 150",
    rating: 4.5,
    status: "inactive"
  },
];

const statusConfig = {
  active: { label: "Ativo", color: "bg-success text-success-foreground" },
  inactive: { label: "Inativo", color: "bg-muted text-muted-foreground" },
  vip: { label: "VIP", color: "bg-warning text-warning-foreground" },
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients] = useState(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie seus clientes e histórico</p>
          </div>
          <PremiumButton variant="premium">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </PremiumButton>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="card-premium lg:col-span-3">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{client.name}</h3>
                        <Badge className={statusConfig[client.status as keyof typeof statusConfig].color}>
                          {statusConfig[client.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Última visita: {client.lastVisit}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                          Avaliação: {client.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="space-y-1">
                        <div>
                          <p className="text-sm text-muted-foreground">Total gasto</p>
                          <p className="text-xl font-bold text-primary">{client.totalSpent}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Agendamentos</p>
                          <p className="text-lg font-semibold">{client.totalAppointments}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <PremiumButton size="sm" variant="outline" title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </PremiumButton>
                      <PremiumButton size="sm" variant="outline" title="Editar">
                        <Edit className="h-4 w-4" />
                      </PremiumButton>
                      <PremiumButton size="sm" variant="outline" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </PremiumButton>
                    </div>
                  </div>
                </div>

                {/* Client Stats Mini Cards */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Último serviço</p>
                      <p className="font-medium">Corte + Escova</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Profissional preferido</p>
                      <p className="font-medium">Maria Santos</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Próximo agendamento</p>
                      <p className="font-medium">15/01 às 14h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar o termo de busca ou adicione um novo cliente.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}