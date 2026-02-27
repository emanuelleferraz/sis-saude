"use client";
import {
  Activity,
  Menu,
  X,
  Home as HomeIcon,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { SharedMenu } from "@/components/SharedMenu";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";

interface HomePageProps {
  onModuleSelect?: (module: string) => void;
}

export default function HomePage({ onModuleSelect }: HomePageProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const router = useRouter();

  const [userName, setUserName] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded: any = jwtDecode(token);
    setUserName(decoded.nome);
  }, []);

  const modules = [
    {
      name: "Doenças Crônicas",
      image: "/doenca-cronica.png",
      key: "dashboard/cronicas",
      bgColor: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },
    {
      name: "Doenças Epidemiológicas",
      image: "/doenca-epidemio.png",
      key: "dashboard/epidemiologicas",
      bgColor: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },
    {
      name: "Vacinação",
      image: "/modulo-vacina.png",
      key: "dashboard/vacinas",
      bgColor: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },
  ];

  function handleMenuClick(key: string) {
    router.push(`/${key}`);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            {/* Logo */}
              <img src="/logo.png" alt="Logo Vitalis" className="h-10 w-auto" />
          </div>

          {/* Barra de pesquisa e perfil */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar..."
                className="pl-10 pr-4 py-2 w-80 rounded-lg"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors">
                  <User className="w-6 h-6 text-gray-700" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("token"); 
                    router.push("/login");
                  }}
                  className="cursor-pointer text-red-600"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {menuOpen && <SharedMenu onMenuItemClick={handleMenuClick} />}
        {/* Conteúdo principal */}
        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-6xl mx-auto">
            {/* Saudação */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl text-gray-800 mb-2">Olá, {userName}</h1>
              <p className="text-xl text-gray-600">
                Quais dados você deseja visualizar?
              </p>
            </div>

            {/* Módulos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {modules.map((module) => (
                <div
                  key={module.key}
                  onClick={() => router.push(`/${module.key}`)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`${module.bgColor} rounded-2xl p-6 transition-all shadow-md group-hover:shadow-xl group-hover:-translate-y-1`}
                  >
                    <img
                      src={module.image}
                      alt={module.name}
                      className="w-full h-auto"
                    />
                  </div>
                  <h3 className="mt-4 text-lg text-gray-800 text-center">
                    {module.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
