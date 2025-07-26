import { AdminLayout } from "@/components/layout/AdminLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, 
  Download, 
  Filter,
  Crown,
  Lock
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const mockData = {
  monthly: [
    { month: "Jan", revenue: 4500, appointments: 120, clients: 85 },
    { month: "Fev", revenue: 5200, appointments: 140, clients: 95 },
    { month: "Mar", revenue: 4800, appointments: 128, clients: 88 },
  ],
  professionals: [
    { name: "João", revenue: 3200, appointments: 85 },
    { name: "Maria", revenue: 4100, appointments: 92 },
    { name: "Carlos", revenue: 2800, appointments: 75 },
  ],
  services: [
    { name: "Corte Masc.", value: 35, color: "#3B82F6" },
    { name: "Corte Fem.", value: 25, color: "#8B5CF6" },
    { name: "Barba", value: 20, color: "#06B6D4" },
    { name: "Coloração", value: 15, color: "#10B981" },
    { name: "Outros", value: 5, color: "#F59E0B" },
  ]
};

export default function Reports() {
  const handleUpgrade = () => {
    window.open('https://stripe.com', '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análise detalhada do seu negócio</p>
          </div>
          <div className="flex space-x-3">
            <PremiumButton variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </PremiumButton>
            <PremiumButton variant="premium">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </PremiumButton>
          </div>
        </div>

        {/* Upgrade Alert */}
        <Alert className="border-warning bg-warning/5">
          <Crown className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-warning-foreground">
              <strong>Relatórios Avançados disponíveis no Plano Pro!</strong> 
              Acesse relatórios detalhados, filtros personalizados, exportação em PDF/Excel e muito mais.
            </span>
            <PremiumButton 
              variant="hero" 
              size="sm" 
              onClick={handleUpgrade}
              className="ml-4"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Pro
            </PremiumButton>
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="start-date">Data Inicial</Label>
                <Input id="start-date" type="date" />
              </div>
              <div>
                <Label htmlFor="end-date">Data Final</Label>
                <Input id="end-date" type="date" />
              </div>
              <div>
                <Label htmlFor="professional">Profissional</Label>
                <select className="w-full p-2 border border-border rounded-md">
                  <option>Todos</option>
                  <option>João Silva</option>
                  <option>Maria Santos</option>
                  <option>Carlos Pereira</option>
                </select>
              </div>
              <div>
                <Label htmlFor="service">Serviço</Label>
                <select className="w-full p-2 border border-border rounded-md">
                  <option>Todos</option>
                  <option>Corte Masculino</option>
                  <option>Corte Feminino</option>
                  <option>Barba</option>
                  <option>Coloração</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <ChartCard title="Evolução do Faturamento">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Professional Performance */}
          <ChartCard title="Performance por Profissional">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.professionals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Services Distribution */}
          <ChartCard title="Distribuição de Serviços">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.services}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.services.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mockData.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: service.color }}
                  />
                  <span className="text-sm">{service.name}: {service.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Appointments Trend */}
          <ChartCard title="Agendamentos por Mês">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Summary Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Clients */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Clientes</h3>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {[
                  { name: "Ana Costa", spent: "R$ 1,540", visits: 22 },
                  { name: "Maria Silva", spent: "R$ 890", visits: 15 },
                  { name: "Pedro Santos", spent: "R$ 650", visits: 12 },
                ].map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.visits} visitas</p>
                    </div>
                    <p className="font-semibold text-primary">{client.spent}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <PremiumButton variant="outline" size="sm" className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  Ver Relatório Completo (Pro)
                </PremiumButton>
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Serviços Mais Lucrativos</h3>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {[
                  { service: "Coloração", revenue: "R$ 2,400", count: 30 },
                  { service: "Corte Feminino", revenue: "R$ 1,750", count: 50 },
                  { service: "Corte + Barba", revenue: "R$ 1,400", count: 40 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-muted-foreground">{item.count} vendas</p>
                    </div>
                    <p className="font-semibold text-primary">{item.revenue}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <PremiumButton variant="outline" size="sm" className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  Análise Detalhada (Pro)
                </PremiumButton>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pro Features Preview */}
        <Card className="card-premium border-primary">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Relatórios Avançados - Plano Pro</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Desbloqueie relatórios completos com análises detalhadas, comparativos mensais/anuais, 
              métricas de rentabilidade, previsões e exportação em múltiplos formatos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Dashboards Personalizados</h4>
                <p className="text-sm text-muted-foreground">Crie relatórios sob medida</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">📈 Análise Preditiva</h4>
                <p className="text-sm text-muted-foreground">Previsões baseadas em IA</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">📄 Exportação Avançada</h4>
                <p className="text-sm text-muted-foreground">PDF, Excel, integração API</p>
              </div>
            </div>
            <PremiumButton variant="hero" size="lg" onClick={handleUpgrade}>
              <Crown className="h-5 w-5 mr-2" />
              Fazer Upgrade por R$ 29,90/mês
            </PremiumButton>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}