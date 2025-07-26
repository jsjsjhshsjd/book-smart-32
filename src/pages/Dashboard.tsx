import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { PremiumButton } from "@/components/ui/premium-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Crown
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";

// Mock data for charts
const appointmentsData = [
  { name: "Seg", appointments: 24 },
  { name: "Ter", appointments: 32 },
  { name: "Qua", appointments: 18 },
  { name: "Qui", appointments: 28 },
  { name: "Sex", appointments: 42 },
  { name: "Sáb", appointments: 35 },
  { name: "Dom", appointments: 15 },
];

const servicesData = [
  { name: "Corte Masculino", value: 35, color: "#3B82F6" },
  { name: "Corte Feminino", value: 25, color: "#8B5CF6" },
  { name: "Barba", value: 20, color: "#06B6D4" },
  { name: "Coloração", value: 15, color: "#10B981" },
  { name: "Outros", value: 5, color: "#F59E0B" },
];

const revenueData = [
  { name: "João", revenue: 1200 },
  { name: "Maria", revenue: 1800 },
  { name: "Pedro", revenue: 950 },
  { name: "Ana", revenue: 1400 },
];

const monthlyData = [
  { month: "Jan", revenue: 4500, appointments: 120 },
  { month: "Fev", revenue: 5200, appointments: 140 },
  { month: "Mar", revenue: 4800, appointments: 128 },
  { month: "Abr", revenue: 6100, appointments: 165 },
  { month: "Mai", revenue: 7200, appointments: 180 },
  { month: "Jun", revenue: 6800, appointments: 172 },
];

export default function Dashboard() {
  const handleUpgrade = () => {
    // Integration with Stripe will be added here
    window.open('https://stripe.com', '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Plano Gratuito
          </Badge>
        </div>

        {/* Upgrade Alert */}
        <Alert className="border-warning bg-warning/5">
          <Crown className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-warning-foreground">
              <strong>Upgrade para Pro!</strong> Libere todas as funcionalidades: relatórios avançados, 
              agendamentos ilimitados, integrações WhatsApp e muito mais.
            </span>
            <PremiumButton 
              variant="hero" 
              size="sm" 
              onClick={handleUpgrade}
              className="ml-4"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Agora
            </PremiumButton>
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Clientes"
            value="1,234"
            change="+12% este mês"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Agendamentos Hoje"
            value="28"
            change="+5% vs ontem"
            icon={Calendar}
            trend="up"
          />
          <StatCard
            title="Profissionais Ativos"
            value="8"
            change="2 novos"
            icon={UserCheck}
            trend="up"
          />
          <StatCard
            title="Faturamento Mensal"
            value="R$ 12.4k"
            change="+18% este mês"
            icon={DollarSign}
            trend="up"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Chart */}
          <ChartCard title="Agendamentos da Semana">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#3B82F6" 
                  fill="url(#appointmentsGradient)" 
                />
                <defs>
                  <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Services Pie Chart */}
          <ChartCard title="Serviços Mais Agendados">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {servicesData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-sm text-muted-foreground">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">{service.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Revenue by Professional */}
          <ChartCard title="Faturamento por Profissional">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Monthly Trends */}
          <ChartCard title="Evolução Mensal">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Faturamento (R$)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Agendamentos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Appointments */}
        <ChartCard title="Próximos Agendamentos">
          <div className="space-y-4">
            {[
              { client: "Maria Silva", service: "Corte + Escova", time: "14:00", professional: "João" },
              { client: "Pedro Santos", service: "Barba", time: "14:30", professional: "Carlos" },
              { client: "Ana Costa", service: "Coloração", time: "15:00", professional: "Maria" },
              { client: "Lucas Oliveira", service: "Corte Masculino", time: "15:30", professional: "João" },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.professional}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </AdminLayout>
  );
}