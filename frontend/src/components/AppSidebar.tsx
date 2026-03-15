import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Funcionários', path: '/funcionarios', icon: Users },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-card border-r border-border flex flex-col z-50">
      {/* Logo area */}
      <div className="px-6 py-8 border-b border-border">
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground tracking-tight">Impacta RH</h1>
          <p className="text-xs text-muted-foreground">Portal Administrativo de Funcionários</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <p className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground mb-4 font-medium">Menu</p>
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <NavLink to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-r-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </motion.div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground">© 2026 Faculdade Impacta</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
