import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mic, History, LayoutDashboard, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Request History",
    url: createPageUrl("RequestHistory"),
    icon: History,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --md-primary: #1976D2;
          --md-primary-dark: #1565C0;
          --md-primary-light: #42A5F5;
          --md-accent: #FFC107;
          --md-accent-dark: #FFA000;
          --md-accent-light: #FFD54F;
          --md-background: #FFFBF0;
          --md-surface: #FFFFFF;
          --md-error: #D32F2F;
          --md-success: #388E3C;
          --md-text-primary: rgba(0, 0, 0, 0.87);
          --md-text-secondary: rgba(0, 0, 0, 0.6);
          --md-divider: rgba(0, 0, 0, 0.12);
        }

        body {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: var(--md-background);
        }

        .material-card {
          background: var(--md-surface);
          border-radius: 4px;
          transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .material-elevation-1 {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
        }

        .material-elevation-2 {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
        }

        .material-elevation-4 {
          box-shadow: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
        }

        .material-elevation-8 {
          box-shadow: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
        }

        .material-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .material-button:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: 'var(--md-background)' }}>
        <Sidebar className="border-r" style={{ borderColor: 'var(--md-divider)' }}>
          <SidebarHeader className="border-b p-6" style={{ borderColor: 'var(--md-divider)', backgroundColor: 'var(--md-primary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center material-elevation-2" style={{ backgroundColor: 'var(--md-accent)' }}>
                <Stethoscope className="w-6 h-6" style={{ color: 'var(--md-text-primary)' }} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-white">MediDispatch</h2>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>AI-Powered Healthcare Routing</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider px-3 py-2" style={{ color: 'var(--md-text-secondary)' }}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`smooth-transition rounded-md mb-1 ${
                          location.pathname === item.url 
                            ? 'material-elevation-1' 
                            : ''
                        }`}
                        style={{
                          backgroundColor: location.pathname === item.url ? 'var(--md-accent)' : 'transparent',
                          color: location.pathname === item.url ? 'var(--md-text-primary)' : 'var(--md-text-primary)'
                        }}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="material-card material-elevation-2 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg smooth-transition" />
              <h1 className="text-xl font-semibold" style={{ color: 'var(--md-text-primary)' }}>MediDispatch</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
