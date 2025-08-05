"use client";
// Necessário para usar useState neste componente de página
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
// import { CheckCircle2, AlertTriangle, Circle, RefreshCw, Clock, Lightbulb } from 'lucide-react';
// import StatusBadge from "../../components/StatusBadge"; // remova se não for mais usado

// Mock de produtos com SKU e status para preview
const produtos = [
  { id: 1, sku: "A1001", nome: "Chapa de Aço", categoria: "Matéria-prima", status: "Concluído" },
  { id: 2, sku: "B2002", nome: "Parafuso M10", categoria: "Acessório", status: "Pendente" },
  { id: 3, sku: "C3003", nome: "Tubo Quadrado", categoria: "Matéria-prima", status: "Atrasado" },
];

export default function ProdutosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Informações'|'Medidas'|'Embalagem'|'Dados'>('Informações');
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  const tabs = ['Informações', 'Medidas', 'Embalagem', 'Dados'] as const;
  const currentTabIndex = tabs.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  
  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  // Debug do estado do modal
  console.log('Estado atual do modal:', modalOpen);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-0rem)] relative px-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-bold leading-[1.2] text-[#111827]">Gestão de Produtos</h1>
        <button
          className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2.5 rounded-md font-medium text-[14px] shadow-sm hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
          onClick={() => {
            console.log('Botão Novo clicado, modalOpen atual:', modalOpen);
            setModalOpen(true);
            console.log('setModalOpen(true) executado');
          }}
        >
          <span className="material-symbols-rounded text-xl">add</span>
          Novo
        </button>
      </div>
      {/* Botão principal '+ Novo' já está presente no cabeçalho */}
      <div className="flex-1 flex flex-col justify-stretch">
        <div className="flex flex-col h-full w-full bg-white">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-[3fr_1fr_1fr] items-center gap-x-4 py-2">
            <div className="text-[12px] font-medium text-[#6B7280]">Nome</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Categoria</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Status</div>
          </div>
          <div className="border-b border-gray-200" />
          {produtos.map((produto, idx) => (
            <div
              key={produto.id}
              className="w-full py-4"
              style={{ borderBottom: idx !== produtos.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <div className="grid grid-cols-[3fr_1fr_1fr] items-center gap-x-4">
                {/* Nome e SKU */}
                <div>
                  <div className="text-[16px] font-medium leading-[1.4] text-[#1F2937]">{produto.nome}</div>
                  <div className="text-[13px] font-normal leading-[1.4] text-[#6B7280] mt-1">SKU: {produto.sku}</div>
                </div>
                {/* Categoria como tag harmonizada */}
                <div>
                  <span className="inline-flex items-center h-5 px-2 text-[13px] font-medium leading-[1.4] rounded-md bg-gray-100 text-[#6B7280]">
                    {produto.categoria}
                  </span>
                </div>
                {/* Status inline estilizado */}
                <div>
                  {produto.status === 'Concluído' && (
                    <span
                      className="inline-flex items-center h-5 px-2 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#e6f4ea', color: '#28a745' }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Concluído
                    </span>
                  )}
                  {produto.status === 'Pendente' && (
                    <span
                      className="inline-flex items-center h-5 px-2 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#fff3e0', color: '#fd7e14' }}
                    >
                      <Circle className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Pendente
                    </span>
                  )}
                  {produto.status === 'Atrasado' && (
                    <span
                      className="inline-flex items-center h-5 px-2 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#f8e6e7', color: '#dc3545' }}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Atrasado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Preencher espaço vazio para efeito fullscreen das linhas */}
          <div className="flex-1 border-b border-gray-200" style={{ minHeight: 0 }} />
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <h2 className="text-[20px] font-semibold text-[#111827]">Adicionar Novo Produto</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Fechar" className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <span className="material-symbols-rounded text-[20px] text-gray-500">close</span>
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Aba Informações */}
              {activeTab === 'Informações' && (
                <form className="grid grid-cols-12 gap-x-6 gap-y-5">
                  {/* Nome do produto */}
                  <div className="col-span-12">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">Nome do produto</label>
                    <input type="text" placeholder="Ex: Camiseta Básica" className="w-full h-[40px] px-3 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                  {/* Descrição */}
                  <div className="col-span-12">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">Descrição</label>
                    <textarea placeholder="Descreva os detalhes do produto..." className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                  {/* SKU */}
                  <div className="col-span-6">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">SKU</label>
                    <input type="text" placeholder="Ex: TSHIRT-001" className="w-full h-[40px] px-3 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                  {/* Categoria */}
                  <div className="col-span-6">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">Categoria</label>
                    <input type="text" placeholder="Ex: Vestuário" className="w-full h-[40px] px-3 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                  {/* Preço de Venda */}
                  <div className="col-span-6">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">Preço de Venda (R$)</label>
                    <input type="number" defaultValue="0.00" className="w-full h-[40px] px-3 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                  {/* Peso */}
                  <div className="col-span-6">
                    <label className="block text-[14px] font-medium text-[#111827] mb-2">Peso (kg)</label>
                    <input type="number" defaultValue="0.0" className="w-full h-[40px] px-3 border border-gray-300 rounded-[6px] text-[14px] font-normal placeholder-[#6B7280]" />
                  </div>
                </form>
              )}
              {/* Placeholder para outras abas */}
              {activeTab !== 'Informações' && <div className="text-[#6B7280]">Em construção...</div>}
            </div>
            {/* Footer */}
            <div className="flex justify-end p-6">
              {isLastTab ? (
                <button className="px-4 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors">Salvar Produto</button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={nextTab}
                    onContextMenu={handleContextMenu}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors text-[13px] font-medium"
                    title="Clique direito para selecionar aba"
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {contextMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setContextMenuOpen(false)}
                      />
                      <div 
                        className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[140px]"
                        style={{ 
                          left: contextMenuPosition.x, 
                          top: contextMenuPosition.y 
                        }}
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveTab(tab);
                              setContextMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-[14px] hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${
                              activeTab === tab ? 'bg-gray-100 font-medium' : 'font-normal'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
