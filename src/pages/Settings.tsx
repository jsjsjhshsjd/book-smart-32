import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Crown } from "lucide-react";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Configure seu sistema</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input id="company" defaultValue="AgendaPlus" />
                </div>
                <div>
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input id="phone" defaultValue="(11) 99999-9999" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Notificações por WhatsApp</Label>
              </div>
              <PremiumButton variant="premium">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </PremiumButton>
            </CardContent>
          </Card>

          <Card className="card-premium border-primary">
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Upgrade para Pro</h3>
              <p className="text-muted-foreground mb-6">
                Libere todas as funcionalidades premium do sistema
              </p>
              <PremiumButton variant="hero" size="lg">
                <Crown className="h-5 w-5 mr-2" />
                Fazer Upgrade - R$ 29,90/mês
              </PremiumButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}