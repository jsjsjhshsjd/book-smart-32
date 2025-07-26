import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  Clock,
  CreditCard,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumButton } from "@/components/ui/premium-button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Agendamentos", path: "/appointments" },
  { icon: Users, label: "Clientes", path: "/clients" },
  { icon: UserCheck, label: "Profissionais", path: "/professionals" },
  { icon: Clock, label: "Serviços", path: "/services" },
  { icon: BarChart3, label: "Relatórios", path: "/reports" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`bg-white border-r border-border h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              AgendaPlus
            </h1>
            <p className="text-xs text-muted-foreground">Sistema de Agendamento</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-3">
        <PremiumButton variant="premium" className="w-full" size={isCollapsed ? "icon" : "default"}>
          <CreditCard className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Upgrade Pro</span>}
        </PremiumButton>
        
        <Button variant="ghost" className="w-full justify-start" size={isCollapsed ? "icon" : "default"}>
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
}