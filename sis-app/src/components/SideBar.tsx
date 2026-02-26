import { Activity, FileText, UserPlus, ClipboardList, Mail, BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

export function Sidebar() {
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [registroOpen, setRegistroOpen] = useState(false);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-blue-600 to-cyan-500 p-3 rounded-xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <span className="text-gray-800">Sistema de Saúde</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Sobre o Sistema */}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <FileText className="w-5 h-5" />
          <span>Sobre o Sistema</span>
        </button>

        {/* Cadastro */}
        <Collapsible open={cadastroOpen} onOpenChange={setCadastroOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5" />
              <span>Cadastro</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${cadastroOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-8 space-y-1">
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
              Cadastro de Paciente
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
              Profissionais de Saúde
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
              Cadastro no Sistema
            </button>
          </CollapsibleContent>
        </Collapsible>

        {/* Registro */}
        <Collapsible open={registroOpen} onOpenChange={setRegistroOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5" />
              <span>Registro</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${registroOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-8 space-y-1">
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
              Registro de Consultas
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors">
              Visitas Domiciliares
            </button>
          </CollapsibleContent>
        </Collapsible>

        {/* Contato */}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <Mail className="w-5 h-5" />
          <span>Contato</span>
        </button>

        {/* Documentação */}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <BookOpen className="w-5 h-5" />
          <span>Documentação</span>
        </button>
      </nav>
    </div>
  );
}
