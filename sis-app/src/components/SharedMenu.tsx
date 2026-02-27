import { Users, Stethoscope, Calendar, Heart, Globe, Syringe, FileText, ChevronDown, ChevronRight, Settings, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';

interface SharedMenuProps {
  onMenuItemClick?: (key: string) => void;
}

export function SharedMenu({ onMenuItemClick }: SharedMenuProps) {
  const [profissionaisOpen, setProfissionaisOpen] = useState(false);
  const [vacinacaoOpen, setVacinacaoOpen] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  const menuItemsBefore = [
    { icon: Users, label: 'Pacientes', key: 'pacientes' },
  ];

  const profissionaisSubItems = [
    { label: 'Médicos', key: 'medicos' },
    { label: 'Enfermeiros/Tec. Enfermagem', key: 'enfermeiros' },
    { label: 'Agentes de Saúde', key: 'agentes' },
  ];

  const vacinacaoSubItems = [
    { label: 'Dashboard', key: 'dashboard/vacinas' },
    { label: 'Registrar Vacinação', key: 'aplicacoes-vacina' },
  ];

  const configuracoesSubItems = [
    { label: 'Bairros', key: 'bairros' },
    { label: 'Endereços', key: 'enderecos' },
    { label: 'Vacinas', key: 'vacinas' },
    { label: 'Unidades PSF', key: 'unidades' },
    { label: 'Doenças', key: 'doencas' },
    { label: 'Usuários', key: 'usuarios' },
  ];

  const menuItemsAfter = [
    { icon: Calendar, label: 'Consultas', key: 'consultas' },
    { icon: HomeIcon, label: 'Visitas Domiciliares', key: 'visitas' },
    { icon: Heart, label: 'Doenças Crônicas', key: 'dashboard/cronicas' },
    { icon: Globe, label: 'Doenças Epidemiológicas', key: 'dashboard/epidemiologicas' },
    { icon: FileText, label: 'Documentação', key: 'documentacao' },
  ];

  return (
    <aside className="w-64 bg-white min-h-[calc(100vh-73px)] shadow-sm border-r border-gray-200">
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          {menuItemsBefore.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onMenuItemClick?.(item.key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          
          {/* Profissionais da Saúde com submenu */}
          <li>
            <button
              onClick={() => setProfissionaisOpen(!profissionaisOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5" />
                <span>Profissionais da Saúde</span>
              </div>
              {profissionaisOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {profissionaisOpen && (
              <ul className="mt-1 ml-4 space-y-1">
                {profissionaisSubItems.map((subItem) => (
                  <li key={subItem.key}>
                    <button
                      onClick={() => onMenuItemClick?.(subItem.key)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          {/* Vacinação com submenu */}
          <li>
            <button
              onClick={() => setVacinacaoOpen(!vacinacaoOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Syringe className="w-5 h-5" />
                <span>Vacinação</span>
              </div>
              {vacinacaoOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {vacinacaoOpen && (
              <ul className="mt-1 ml-4 space-y-1">
                {vacinacaoSubItems.map((subItem) => (
                  <li key={subItem.key}>
                    <button
                      onClick={() => onMenuItemClick?.(subItem.key)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          
          {menuItemsAfter.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onMenuItemClick?.(item.key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          
          {/* Configurações com submenu - Por último */}
          <li>
            <button
              onClick={() => setConfiguracoesOpen(!configuracoesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </div>
              {configuracoesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {configuracoesOpen && (
              <ul className="mt-1 ml-4 space-y-1">
                {configuracoesSubItems.map((subItem) => (
                  <li key={subItem.key}>
                    <button
                      onClick={() => onMenuItemClick?.(subItem.key)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}