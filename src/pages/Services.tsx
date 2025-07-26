import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Plus, 
  Search, 
  DollarSign,
  Edit,
  Trash2,
  User
} from "lucide-react";

const mockServices = [
  {
    id: 1,
    name: "Corte Masculino",
    description: "Corte moderno e estilizado",
    duration: 30,
    price: 25,
    professional: "João Silva",
    category: "Cortes",
    status: "active",
    appointments: 45
  },
  {
    id: 2,
    name: "Corte Feminino",
    description: "Corte feminino com finalização",
    duration: 45,
    price: 35,
    professional: "Maria Santos",
    category: "Cortes",
    status: "active",
    appointments: 38
  },
  {
    id: 3,
    name: "Barba",
    description: "Barba aparada e finalizada",
    duration: 20,
    price: 15,
    professional: "Carlos Pereira",
    category: "Barba",
    status: "active",
    appointments: 32
  },
  {
    id: 4,
    name: "Corte + Barba",
    description: "Combo completo de corte e barba",
    duration: 45,
    price: 35,
    professional: "João Silva",
    category: "Combos",
    status: "active",
    appointments: 28
  },
  {
    id: 5,
    name: "Coloração",
    description: "Coloração completa com produtos premium",
    duration: 90,
    price: 80,
    professional: "Ana Costa",
    category: "Coloração",
    status: "inactive",
    appointments: 15
  },
  {
    id: 6,
    name: "Escova",
    description: "Escova modeladora com finalização",
    duration: 30,
    price: 25,
    professional: "Maria Santos",
    category: "Finalização",
    status: "active",
    appointments: 22
  },
];

const categories = ["Todos", "Cortes", "Barba", "Combos", "Coloração", "Finalização"];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [services, setServices] = useState(mockServices);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.professional.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleStatus = (id: number) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id
          ? { ...service, status: service.status === "active" ? "inactive" : "active" }
          : service
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground">Gerencie todos os serviços oferecidos</p>
          </div>
          <PremiumButton variant="premium">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </PremiumButton>
        </div>

        {/* Filters */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <PremiumButton
                    key={category}
                    variant={selectedCategory === category ? "premium" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </PremiumButton>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>
                        {service.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                    <Badge variant="outline" className="mb-3">{service.category}</Badge>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Preço
                    </div>
                    <span className="text-xl font-bold text-primary">R$ {service.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Duração
                    </div>
                    <span className="font-medium">{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      Profissional
                    </div>
                    <span className="font-medium">{service.professional}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-muted/30 p-3 rounded-lg mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{service.appointments}</p>
                    <p className="text-sm text-muted-foreground">agendamentos este mês</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={service.status === "active"}
                      onCheckedChange={() => toggleStatus(service.id)}
                    />
                    <span className="text-sm">
                      {service.status === "active" ? "Ativo" : "Inativo"}
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou adicione um novo serviço.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{services.filter(s => s.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Serviços Ativos</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">R$ {Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length)}</p>
              <p className="text-sm text-muted-foreground">Preço Médio</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)} min</p>
              <p className="text-sm text-muted-foreground">Duração Média</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{services.reduce((acc, s) => acc + s.appointments, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Agendamentos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}