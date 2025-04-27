import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PnL from "@/pages/pnl";
import AIAgents from "@/pages/ai-agents";
import AdOptimizer from "@/pages/ad-optimizer";
import PMFIntelligence from "@/pages/pmf-intelligence";
import CustomerVault from "@/pages/customer-vault";
import SupportRadar from "@/pages/support-radar";
import SEOAutopilot from "@/pages/seo-autopilot";
import OpsTasks from "@/pages/ops-tasks";
import MeetingGPT from "@/pages/meeting-gpt";
import { AppLayout } from "@/components/layout/AppLayout";
import { BrandProvider } from "@/providers/BrandProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pnl" component={PnL} />
      <Route path="/ai-agents" component={AIAgents} />
      <Route path="/ad-optimizer" component={AdOptimizer} />
      <Route path="/pmf-intelligence" component={PMFIntelligence} />
      <Route path="/customer-vault" component={CustomerVault} />
      <Route path="/support-radar" component={SupportRadar} />
      <Route path="/seo-autopilot" component={SEOAutopilot} />
      <Route path="/ops-tasks" component={OpsTasks} />
      <Route path="/meeting-gpt" component={MeetingGPT} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <BrandProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </BrandProvider>
    </TooltipProvider>
  );
}

export default App;
