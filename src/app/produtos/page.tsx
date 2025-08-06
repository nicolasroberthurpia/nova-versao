"use client";
// Necessário para usar useState neste componente de página
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronRight, FileText, Maximize, Box, Settings } from 'lucide-react';
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
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    categoria: '',
    preco: '0.00',
    peso: '0.0',
    // Campos de medidas
    comprimento: '',
    altura: '',
    largura: '',
    espessuraFerro: '',
    espessuraMdf: '',
    distanciaNichos: '',
    distanciaVaroes: ''
  });

  // Estado para embalagens
  const [embalagens, setEmbalagens] = useState([
    { id: 1, comprimento: '', altura: '', largura: '' }
  ]);
  const [numeroVolumes, setNumeroVolumes] = useState(1);
  
  const tabs = ['Informações', 'Medidas', 'Embalagem', 'Dados'] as const;
  
  // Configuração das abas com ícones e descrições
  const tabsConfig = {
    'Informações': {
      icon: FileText,
      title: 'Informações Básicas',
      description: 'Nome, descrição, categoria e dados gerais do produto'
    },
    'Medidas': {
      icon: Maximize,
      title: 'Medidas e Dimensões',
      description: 'Dimensões físicas e especificações técnicas'
    },
    'Embalagem': {
      icon: Box,
      title: 'Embalagem e Estoque',
      description: 'Tipo de embalagem, quantidade e informações de estoque'
    },
    'Dados': {
      icon: Settings,
      title: 'Dados Adicionais',
      description: 'Código de barras, fornecedor e informações complementares'
    }
  };
  const currentTabIndex = tabs.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;
  
  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const openModal = () => {
    setActiveTab('Informações'); // Sempre reseta para a primeira aba
    setNumeroVolumes(1); // Reseta para 1 volume
    setEmbalagens([{ id: 1, comprimento: '', altura: '', largura: '' }]); // Reseta embalagens
    setModalOpen(true);
  };

  // Funções para gerenciar embalagens
  const handleNumeroVolumesChange = (value: string) => {
    const num = parseInt(value) || 1;
    setNumeroVolumes(num);
    
    // Ajustar array de embalagens baseado no número
    const currentLength = embalagens.length;
    
    if (num > currentLength) {
      // Adicionar embalagens
      const newEmbalagens = [...embalagens];
      for (let i = currentLength; i < num; i++) {
        newEmbalagens.push({ id: i + 1, comprimento: '', altura: '', largura: '' });
      }
      setEmbalagens(newEmbalagens);
    } else if (num < currentLength) {
      // Remover embalagens
      setEmbalagens(embalagens.slice(0, num));
    }
  };

  const updateEmbalagem = (id: number, field: string, value: string) => {
    setEmbalagens(embalagens.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  // Função para verificar se o valor é "n" ou variações
  const isNotApplicable = (value: string) => {
    return value.toLowerCase().trim() === 'n' || value.toLowerCase().trim() === 'n/a' || value.toLowerCase().trim() === 'na';
  };

  // Função para lidar com mudanças nos campos
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para obter classes CSS baseadas no valor
  const getFieldClasses = (value: string) => {
    const baseClasses = "w-full h-[40px] px-3 border rounded-[6px] text-[14px] font-normal transition-all duration-200";
    
    if (isNotApplicable(value)) {
      return `${baseClasses} bg-gray-100 text-gray-500 border-gray-200 placeholder-gray-400`;
    }
    
    return `${baseClasses} border-gray-300 placeholder-[#6B7280]`;
  };

  // Função para obter classes CSS para textarea
  const getTextareaClasses = (value: string) => {
    const baseClasses = "w-full min-h-[100px] px-3 py-2 border rounded-[6px] text-[14px] font-normal transition-all duration-200";
    
    if (isNotApplicable(value)) {
      return `${baseClasses} bg-gray-100 text-gray-500 border-gray-200 placeholder-gray-400`;
    }
    
    return `${baseClasses} border-gray-300 placeholder-[#6B7280]`;
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-0rem)] relative px-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-bold leading-[1.2] text-[#111827]">Gestão de Produtos</h1>
        <button
          className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2.5 rounded-md font-medium text-[14px] shadow-sm hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
          onClick={openModal}
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
                  <span className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md bg-gray-200 text-[#4B5563]">
                    {produto.categoria}
                  </span>
                </div>
                {/* Status inline estilizado */}
                <div>
                  {produto.status === 'Concluído' && (
                    <span
                      className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#d1f2dd', color: '#1e7e34' }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Concluído
                    </span>
                  )}
                  {produto.status === 'Pendente' && (
                    <span
                      className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#ffeaa7', color: '#e17000' }}
                    >
                      <Circle className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Pendente
                    </span>
                  )}
                  {produto.status === 'Atrasado' && (
                    <span
                      className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md gap-1"
                      style={{ backgroundColor: '#f5c6cb', color: '#a71d2a' }}
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
          <div className="bg-white rounded-xl shadow-lg w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 rounded-t-xl">
              {/* Seção da Aba Atual */}
              <div className="px-8 py-7">
                <div className="flex items-center justify-between">
                  {/* Informações da aba atual */}
                  <div className="flex items-center gap-6 flex-1">
                    {(() => {
                      const currentConfig = tabsConfig[activeTab];
                      const IconComponent = currentConfig.icon;
                      return (
                        <>
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-gray-200" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                            <IconComponent className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[19px] font-semibold text-[#111827] mb-1 leading-tight">
                              {currentConfig.title}
                            </h3>
                            <p className="text-[14px] text-[#6B7280] leading-normal">
                              {currentConfig.description}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Botão fechar discreto */}
                  <button 
                    onClick={() => setModalOpen(false)} 
                    aria-label="Fechar" 
                    className="p-1 transition-colors opacity-60 hover:opacity-100"
                  >
                    <span className="material-symbols-rounded text-[18px] text-gray-400">close</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-7">
              <div className="transition-opacity duration-200 ease-in-out">
                {/* Aba Informações */}
                {activeTab === 'Informações' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Nome do produto */}
                    <div className="col-span-12">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Nome do produto</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Camiseta Básica" 
                        value={formData.nome}
                        onChange={(e) => handleFieldChange('nome', e.target.value)}
                        className={getFieldClasses(formData.nome)}
                      />
                      {isNotApplicable(formData.nome) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Descrição */}
                    <div className="col-span-12">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Descrição</label>
                      <textarea 
                        placeholder="Descreva os detalhes do produto..." 
                        value={formData.descricao}
                        onChange={(e) => handleFieldChange('descricao', e.target.value)}
                        className={getTextareaClasses(formData.descricao)}
                      />
                      {isNotApplicable(formData.descricao) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* SKU */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">SKU</label>
                      <input 
                        type="text" 
                        placeholder="Ex: TSHIRT-001" 
                        value={formData.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value)}
                        className={getFieldClasses(formData.sku)}
                      />
                      {isNotApplicable(formData.sku) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Categoria */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Categoria</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Vestuário" 
                        value={formData.categoria}
                        onChange={(e) => handleFieldChange('categoria', e.target.value)}
                        className={getFieldClasses(formData.categoria)}
                      />
                      {isNotApplicable(formData.categoria) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Preço de Venda */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Preço de Venda (R$)</label>
                      <input 
                        type="text" 
                        value={formData.preco}
                        onChange={(e) => handleFieldChange('preco', e.target.value)}
                        className={getFieldClasses(formData.preco)}
                      />
                      {isNotApplicable(formData.preco) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Peso */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Peso (kg)</label>
                      <input 
                        type="text" 
                        value={formData.peso}
                        onChange={(e) => handleFieldChange('peso', e.target.value)}
                        className={getFieldClasses(formData.peso)}
                      />
                      {isNotApplicable(formData.peso) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                  </form>
                )}
                
                {/* Aba Medidas */}
                {activeTab === 'Medidas' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Dimensões Gerais */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Dimensões Gerais</h4>
                    </div>
                    
                    {/* Comprimento */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Comprimento (cm)</label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.comprimento}
                        onChange={(e) => handleFieldChange('comprimento', e.target.value)}
                        className={getFieldClasses(formData.comprimento)}
                      />
                      {isNotApplicable(formData.comprimento) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Altura */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Altura (cm)</label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.altura}
                        onChange={(e) => handleFieldChange('altura', e.target.value)}
                        className={getFieldClasses(formData.altura)}
                      />
                      {isNotApplicable(formData.altura) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Largura */}
                    <div className="col-span-4">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Largura (cm)</label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.largura}
                        onChange={(e) => handleFieldChange('largura', e.target.value)}
                        className={getFieldClasses(formData.largura)}
                      />
                      {isNotApplicable(formData.largura) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    
                    {/* Espessuras */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Espessuras dos Materiais</h4>
                    </div>
                    
                    {/* Espessura do Ferro */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Espessura do Ferro (mm)</label>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraFerro}
                        onChange={(e) => handleFieldChange('espessuraFerro', e.target.value)}
                        className={getFieldClasses(formData.espessuraFerro)}
                      />
                      {isNotApplicable(formData.espessuraFerro) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Espessura do MDF */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Espessura do MDF (mm)</label>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraMdf}
                        onChange={(e) => handleFieldChange('espessuraMdf', e.target.value)}
                        className={getFieldClasses(formData.espessuraMdf)}
                      />
                      {isNotApplicable(formData.espessuraMdf) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    
                    {/* Distâncias */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Distâncias e Espaçamentos</h4>
                    </div>
                    
                    {/* Distância dos Nichos */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Distância dos Nichos (cm)</label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaNichos}
                        onChange={(e) => handleFieldChange('distanciaNichos', e.target.value)}
                        className={getFieldClasses(formData.distanciaNichos)}
                      />
                      {isNotApplicable(formData.distanciaNichos) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Distância dos Varões */}
                    <div className="col-span-6">
                      <label className="block text-[14px] font-medium text-[#111827] mb-2">Distância dos Varões (cm)</label>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaVaroes}
                        onChange={(e) => handleFieldChange('distanciaVaroes', e.target.value)}
                        className={getFieldClasses(formData.distanciaVaroes)}
                      />
                      {isNotApplicable(formData.distanciaVaroes) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                  </form>
                )}
                
                {/* Aba Embalagem */}
                {activeTab === 'Embalagem' && (
                  <form className="grid grid-cols-12 gap-x-6 gap-y-5 animate-in fade-in duration-300">
                    {/* Título */}
                    <div className="col-span-12">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-4 pb-2 border-b border-gray-200">Dimensões das Embalagens</h4>
                    </div>
                    
                    {/* Card de escolha de quantidade */}
                    <div className="col-span-12">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="text-[14px] font-medium text-[#111827]">Número de volumes:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={numeroVolumes}
                          onChange={(e) => handleNumeroVolumesChange(e.target.value)}
                          className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center bg-white"
                        />
                      </div>
                    </div>

                    {/* Lista de embalagens */}
                    {embalagens.map((embalagem, index) => (
                      <div key={embalagem.id} className="col-span-12 space-y-4">
                        {/* Campos da embalagem com título inline */}
                        <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                          {/* Comprimento */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Comprimento {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.comprimento}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'comprimento', e.target.value)}
                              className={getFieldClasses(embalagem.comprimento)}
                            />
                            {isNotApplicable(embalagem.comprimento) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                          
                          {/* Altura */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Altura {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.altura}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'altura', e.target.value)}
                              className={getFieldClasses(embalagem.altura)}
                            />
                            {isNotApplicable(embalagem.altura) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                          
                          {/* Largura */}
                          <div className="col-span-4">
                            <label className="block text-[13px] font-medium text-[#111827] mb-2">
                              Largura {index + 1} (cm)
                            </label>
                            <input 
                              type="text" 
                              placeholder="0" 
                              value={embalagem.largura}
                              onChange={(e) => updateEmbalagem(embalagem.id, 'largura', e.target.value)}
                              className={getFieldClasses(embalagem.largura)}
                            />
                            {isNotApplicable(embalagem.largura) && (
                              <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                            )}
                          </div>
                        </div>

                        {/* Separador entre embalagens */}
                        {index < embalagens.length - 1 && (
                          <div className="border-b border-gray-200 mt-6"></div>
                        )}
                      </div>
                    ))}
                  </form>
                )}
                
                {/* Placeholder para outras abas */}
                {activeTab !== 'Informações' && activeTab !== 'Medidas' && activeTab !== 'Embalagem' && (
                  <div className="text-center py-16 animate-in fade-in duration-300">
                    <div className="text-[#6B7280] text-lg mb-2">Em construção...</div>
                    <div className="text-[#9CA3AF] text-sm">
                      A aba "{activeTab}" será implementada em breve.
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center px-8 py-6 border-t border-gray-200 rounded-b-xl">
              <div>
                {!isFirstTab && (
                  <button 
                    onClick={prevTab}
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-[14px] font-medium"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Voltar
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {isLastTab ? (
                  <button className="px-6 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors text-[14px] font-medium">
                    Salvar Produto
                  </button>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={nextTab}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenuPosition({ x: e.clientX, y: e.clientY });
                        setContextMenuOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111827] text-white hover:bg-black transition-colors text-[14px] font-medium"
                      title="Clique direito para ver todas as etapas"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    {/* Popup com todas as etapas */}
                    {contextMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ease-out" 
                          onClick={() => setContextMenuOpen(false)}
                        />
                        <div 
                          className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-80 animate-in fade-in zoom-in-95 duration-300"
                        >
                          <div className="p-4">
                            <h4 className="text-[14px] font-semibold text-[#111827] mb-3 text-center">Escolher Etapa</h4>
                            <div className="space-y-1.5">
                              {tabs.map((tab, index) => {
                                const config = tabsConfig[tab];
                                const IconComponent = config.icon;
                                const isActive = index === currentTabIndex;
                                const isCompleted = index < currentTabIndex;
                                
                                return (
                                  <button
                                    key={tab}
                                    onClick={() => {
                                      setActiveTab(tab);
                                      setContextMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-[#111827] text-white transform scale-[1.01]' 
                                        : 'hover:bg-gray-50 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-white text-[#111827] border-white' 
                                        : isCompleted 
                                          ? 'bg-[#111827] text-white border-[#111827]'
                                          : 'bg-white text-gray-500 border-gray-200'
                                    }`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-[13px] font-medium ${isActive ? 'text-white' : 'text-[#111827]'}`}>
                                        {config.title}
                                      </div>
                                      <div className={`text-[11px] truncate ${isActive ? 'text-gray-200' : 'text-[#6B7280]'}`}>
                                        {config.description}
                                      </div>
                                    </div>
                                    {isActive && (
                                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
