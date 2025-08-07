"use client";
// Necessário para usar useState neste componente de página
import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronRight, FileText, Maximize, Box, Settings, Package, Trash2, Lightbulb } from 'lucide-react';

// Mock de produtos com SKU, peso e preço para preview
const produtos = [
  { id: 1, sku: "A1001", nome: "Chapa de Aço Galvanizado", categoria: "Matéria-prima", peso: 2.45, preco: 85.90 },
  { id: 2, sku: "B2002", nome: "Parafuso Sextavado M10", categoria: "Fixação", peso: 0.025, preco: 1.50 },
  { id: 3, sku: "C3003", nome: "Tubo Quadrado 50x50", categoria: "Estrutural", peso: 5.80, preco: 42.75 },
  { id: 4, sku: "D4004", nome: "Porca Sextavada M10", categoria: "Fixação", peso: 0.015, preco: 0.85 },
  { id: 5, sku: "E5005", nome: "Chapa MDF 15mm", categoria: "Acabamento", peso: 8.20, preco: 65.00 },
  { id: 6, sku: "F6006", nome: "Solda Eletrodo 3,25mm", categoria: "Consumível", peso: 0.050, preco: 2.25 },
];

// Mock de componentes disponíveis para seleção
const componentesDisponiveis = [
  { id: 1, nome: "Parafuso M6x20", peso: 0.015, valor: 0.25 },
  { id: 2, nome: "Porca M6", peso: 0.008, valor: 0.15 },
  { id: 3, nome: "Arruela Lisa 6mm", peso: 0.003, valor: 0.05 },
  { id: 4, nome: "Chapa Aço 100x50", peso: 0.785, valor: 12.50 },
  { id: 5, nome: "Tubo 20x20x2", peso: 1.232, valor: 8.75 },
  { id: 6, nome: "Solda MIG", peso: 0.001, valor: 0.10 },
];

export default function ProdutosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Informações'|'Medidas'|'Componentes'|'Embalagem'|'Dados'>('Informações');
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  // Estados para sistema de lembretes
  const [fieldReminders, setFieldReminders] = useState<Record<string, { reminders: string[]; info: string }>>({
    nome: { reminders: ['Usar nomenclatura padronizada'], info: 'O nome deve ser claro e descritivo' },
    descricao: { reminders: ['Incluir especificações técnicas'], info: 'Descrição detalhada do produto' },
    comprimento: { reminders: ['Verificar unidade de medida'], info: 'Medida em centímetros' }
  });
  const [editModal, setEditModal] = useState<{ open: boolean; field: string; type: 'reminder' | 'info' }>({
    open: false, field: '', type: 'reminder'
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; field: string }>({
    open: false, field: ''
  });
  const [editValue, setEditValue] = useState('');
  
  // Estados para controlar qual campo está ativo para mostrar a lâmpada
  const [activeField, setActiveField] = useState<string | null>(null);
  const [lampHoverField, setLampHoverField] = useState<string | null>(null);
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    categoria: '',
    // Campos de medidas
    comprimento: '',
    altura: '',
    largura: '',
    espessuraFerro: '',
    espessuraMdf: '',
    distanciaNichos: '',
    distanciaVaroes: '',
    // Links padrão
    driveLink: '',
    olistLink: '',
    // Observação do usuário
    observacao: ''
  });
  // Links personalizados
  const [customLinks, setCustomLinks] = useState<Array<{ id: number; name: string; url: string }>>([]);

  // Funções para gerenciar links personalizados
  const addCustomLink = () => {
    const newId = customLinks.length > 0 ? Math.max(...customLinks.map(l => l.id)) + 1 : 1;
    setCustomLinks([...customLinks, { id: newId, name: '', url: '' }]);
  };
  const updateCustomLink = (id: number, field: 'name'|'url', value: string) => {
    setCustomLinks(customLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const removeCustomLink = (id: number) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

  // Funções para sistema de lembretes
  // Funções para gerenciar lembretes
  const openEditModal = (field: string, type: 'reminder' | 'info') => {
    const current = fieldReminders[field];
    setEditValue(type === 'reminder' ? '' : (current?.info || ''));
    setEditModal({ open: true, field, type });
    setViewModal({ open: false, field: '' });
  };

  const saveFieldData = () => {
    const { field, type } = editModal;
    setFieldReminders(prev => {
      const entry = prev[field] || { reminders: [], info: '' };
      if (type === 'reminder') {
        return {
          ...prev,
          [field]: { ...entry, reminders: [...(entry.reminders || []), editValue] }
        };
      }
      return { ...prev, [field]: { ...entry, info: editValue } };
    });
    setEditModal({ open: false, field: '', type: 'reminder' });
    setEditValue('');
    // Reabrir o modal de visualização
    setViewModal({ open: true, field });
  };

  const removeFieldData = (field: string, type: 'reminder' | 'info') => {
    setFieldReminders(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: ''
      }
    }));
  };

  // Componente para mostrar ícone de lâmpada quando o campo está ativo
  const LightBulbIndicator = ({ fieldName }: { fieldName: string }) => {
    const hasReminder = (fieldReminders[fieldName]?.reminders?.length || 0) > 0;
    const hasInfo = fieldReminders[fieldName]?.info?.length > 0;
    const isActive = activeField === fieldName || lampHoverField === fieldName;
    
    if (!isActive) return null;
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setViewModal({ open: true, field: fieldName });
      setActiveField(null); // Limpa o campo ativo após clicar
      setLampHoverField(null);
    };

    const handleMouseEnter = () => {
      setLampHoverField(fieldName);
    };

    const handleMouseLeave = () => {
      // Só remove se não for o campo ativo
      if (activeField !== fieldName) {
        setLampHoverField(null);
      }
    };

    // Define a cor do ícone baseado na presença de lembretes
    const iconColor = hasReminder || hasInfo 
      ? 'text-yellow-500 hover:text-yellow-600' 
      : 'text-gray-400 hover:text-gray-500';
    
    return (
      <button 
        className={`ml-1.5 p-0.5 transition-all duration-200 ${iconColor}`}
        title={hasReminder || hasInfo ? 'Ver lembretes e informações' : 'Criar lembrete'}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type="button"
      >
        <Lightbulb className="w-4 h-4" />
      </button>
    );
  };

  // Função para lidar com o blur de forma inteligente
  const handleFieldBlur = (fieldName: string) => {
    // Pequeno delay para permitir clique na lâmpada
    setTimeout(() => {
      if (lampHoverField !== fieldName) {
        setActiveField(null);
      }
    }, 150);
  };

  // Estado para componentes
  const [componentes, setComponentes] = useState<Array<{
    id: number;
    componenteId: number;
    nome: string;
    quantidade: number;
    peso: number;
    valor: number;
  }>>([]);
  // Overrides globais de peso e valor
  const [pesoManual, setPesoManual] = useState<string>('');
  const [valorManual, setValorManual] = useState<string>('');

  // Estado para embalagens
  const [embalagens, setEmbalagens] = useState([
    { id: 1, comprimento: '', altura: '', largura: '' }
  ]);
  const [numeroVolumes, setNumeroVolumes] = useState(1);
  
  const tabs = ['Informações', 'Medidas', 'Componentes', 'Embalagem', 'Dados'] as const;
  
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
    'Componentes': {
      icon: Package,
      title: 'Componentes do Produto',
      description: 'Peças e materiais que compõem o produto'
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
    setComponentes([]); // Reseta componentes
    setModalOpen(true);
  };

  // Funções para gerenciar componentes
  const addComponente = () => {
    const newId = Math.max(0, ...componentes.map(c => c.id)) + 1;
    setComponentes([...componentes, {
      id: newId,
      componenteId: 0,
      nome: '',
      quantidade: 1,
      peso: 0,
      valor: 0,
    }]);
  };

  const removeComponente = (id: number) => {
    setComponentes(componentes.filter(c => c.id !== id));
  };

  const updateComponente = (id: number, field: string, value: any) => {
    setComponentes(componentes.map(c => {
      if (c.id === id) {
        if (field === 'componenteId') {
          const selectedComponent = componentesDisponiveis.find(comp => comp.id === parseInt(value));
          if (selectedComponent) {
            return {
              ...c,
              componenteId: parseInt(value),
              nome: selectedComponent.nome,
              peso: selectedComponent.peso,
              valor: selectedComponent.valor
            };
          }
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const calcularTotais = () => {
    return componentes.reduce((acc, comp) => {
      acc.pesoTotal += comp.peso * comp.quantidade;
      acc.valorTotal += comp.valor * comp.quantidade;
      return acc;
    }, { pesoTotal: 0, valorTotal: 0 });
  };

  const { pesoTotal, valorTotal } = calcularTotais();
  // Calcular volume total das embalagens
  const calcularVolumeTotal = () => embalagens.reduce((acc, e) => {
    const l = parseFloat(e.comprimento) || 0;
    const a = parseFloat(e.altura) || 0;
    const w = parseFloat(e.largura) || 0;
    return acc + l * a * w;
  }, 0);
  const totalVolumeCm3 = calcularVolumeTotal();
  const volumeSide = Math.cbrt(totalVolumeCm3);

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

  const [modalTab, setModalTab] = useState<'lembretes'|'info'>('lembretes');

  useEffect(() => {
    if (viewModal.open) setModalTab('lembretes');
  }, [viewModal.open]);

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
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center gap-x-4 py-2">
            <div className="text-[12px] font-medium text-[#6B7280]">Nome</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Categoria</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Peso</div>
            <div className="text-[12px] font-medium text-[#6B7280]">Preço</div>
          </div>
          <div className="border-b border-gray-200" />
          {produtos.map((produto, idx) => (
            <div
              key={produto.id}
              className="w-full py-3"
              style={{ borderBottom: idx !== produtos.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <div className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center gap-x-4">
                {/* Nome e SKU */}
                <div>
                  <div className="text-[16px] font-normal leading-[1.4] text-[#1F2937]">{produto.nome}</div>
                  <div className="text-[13px] font-normal leading-[1.4] text-[#6B7280] mt-1">SKU: {produto.sku}</div>
                </div>
                {/* Categoria como tag harmonizada */}
                <div>
                  <span className="inline-flex items-center h-6 px-3 text-[13px] font-medium leading-[1.4] rounded-md bg-gray-100 text-[#4B5563]">
                    {produto.categoria}
                  </span>
                </div>
                {/* Peso */}
                <div>
                  <span className="text-[14px] font-normal text-[#1F2937]">
                    {produto.peso.toFixed(3)} kg
                  </span>
                </div>
                {/* Preço */}
                <div>
                  <span className="text-[14px] font-normal text-[#1F2937]">
                    R$ {produto.preco.toFixed(2)}
                  </span>
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
                    {/* Cabeçalho refinado */}
                    {(() => {
                      const currentConfig = tabsConfig[activeTab];
                      const IconComponent = currentConfig.icon;
                      return (
                        <>
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 shadow-sm">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[18px] font-semibold text-gray-800 mb-1 leading-snug">
                              {currentConfig.title}
                            </h3>
                            <p className="text-[13px] text-gray-600 leading-tight">
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
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Nome do produto
                        </label>
                        <LightBulbIndicator fieldName="nome" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ex: Camiseta Básica" 
                        value={formData.nome}
                        onChange={(e) => handleFieldChange('nome', e.target.value)}
                        className={getFieldClasses(formData.nome)}
                        onFocus={() => setActiveField('nome')}
                        onBlur={() => handleFieldBlur('nome')}
                      />
                      {isNotApplicable(formData.nome) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Descrição */}
                    <div className="col-span-12">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Descrição
                        </label>
                        <LightBulbIndicator fieldName="descricao" />
                      </div>
                      <textarea 
                        placeholder="Descreva os detalhes do produto..." 
                        value={formData.descricao}
                        onChange={(e) => handleFieldChange('descricao', e.target.value)}
                        className={getTextareaClasses(formData.descricao)}
                        onFocus={() => setActiveField('descricao')}
                        onBlur={() => handleFieldBlur('descricao')}
                      />
                      {isNotApplicable(formData.descricao) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* SKU */}
                    <div className="col-span-6">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          SKU
                        </label>
                        <LightBulbIndicator fieldName="sku" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ex: TSHIRT-001" 
                        value={formData.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value)}
                        className={getFieldClasses(formData.sku)}
                        onFocus={() => setActiveField('sku')}
                        onBlur={() => handleFieldBlur('sku')}
                      />
                      {isNotApplicable(formData.sku) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Categoria */}
                    <div className="col-span-6">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Categoria
                        </label>
                        <LightBulbIndicator fieldName="categoria" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ex: Vestuário" 
                        value={formData.categoria}
                        onChange={(e) => handleFieldChange('categoria', e.target.value)}
                        className={getFieldClasses(formData.categoria)}
                        onFocus={() => setActiveField('categoria')}
                        onBlur={() => handleFieldBlur('categoria')}
                      />
                      {isNotApplicable(formData.categoria) && (
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
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Comprimento (cm)
                        </label>
                        <LightBulbIndicator fieldName="comprimento" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.comprimento}
                        onChange={(e) => handleFieldChange('comprimento', e.target.value)}
                        className={getFieldClasses(formData.comprimento)}
                        onFocus={() => setActiveField('comprimento')}
                        onBlur={() => handleFieldBlur('comprimento')}
                      />
                      {isNotApplicable(formData.comprimento) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Altura */}
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Altura (cm)
                        </label>
                        <LightBulbIndicator fieldName="altura" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.altura}
                        onChange={(e) => handleFieldChange('altura', e.target.value)}
                        className={getFieldClasses(formData.altura)}
                        onFocus={() => setActiveField('altura')}
                        onBlur={() => handleFieldBlur('altura')}
                      />
                      {isNotApplicable(formData.altura) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Largura */}
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Largura (cm)
                        </label>
                        <LightBulbIndicator fieldName="largura" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.largura}
                        onChange={(e) => handleFieldChange('largura', e.target.value)}
                        className={getFieldClasses(formData.largura)}
                        onFocus={() => setActiveField('largura')}
                        onBlur={() => handleFieldBlur('largura')}
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
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Espessura do Ferro (mm)
                        </label>
                        <LightBulbIndicator fieldName="espessuraFerro" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraFerro}
                        onChange={(e) => handleFieldChange('espessuraFerro', e.target.value)}
                        className={getFieldClasses(formData.espessuraFerro)}
                        onFocus={() => setActiveField('espessuraFerro')}
                        onBlur={() => handleFieldBlur('espessuraFerro')}
                      />
                      {isNotApplicable(formData.espessuraFerro) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Espessura do MDF */}
                    <div className="col-span-6">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Espessura do MDF (mm)
                        </label>
                        <LightBulbIndicator fieldName="espessuraMdf" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0.0" 
                        value={formData.espessuraMdf}
                        onChange={(e) => handleFieldChange('espessuraMdf', e.target.value)}
                        className={getFieldClasses(formData.espessuraMdf)}
                        onFocus={() => setActiveField('espessuraMdf')}
                        onBlur={() => handleFieldBlur('espessuraMdf')}
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
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Distância dos Nichos (cm)
                        </label>
                        <LightBulbIndicator fieldName="distanciaNichos" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaNichos}
                        onChange={(e) => handleFieldChange('distanciaNichos', e.target.value)}
                        className={getFieldClasses(formData.distanciaNichos)}
                        onFocus={() => setActiveField('distanciaNichos')}
                        onBlur={() => handleFieldBlur('distanciaNichos')}
                      />
                      {isNotApplicable(formData.distanciaNichos) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                    {/* Distância dos Varões */}
                    <div className="col-span-6">
                      <div className="flex items-center">
                        <label className="block text-[14px] font-medium text-[#111827] mb-2 cursor-pointer select-none">
                          Distância dos Varões (cm)
                        </label>
                        <LightBulbIndicator fieldName="distanciaVaroes" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0" 
                        value={formData.distanciaVaroes}
                        onChange={(e) => handleFieldChange('distanciaVaroes', e.target.value)}
                        className={getFieldClasses(formData.distanciaVaroes)}
                        onFocus={() => setActiveField('distanciaVaroes')}
                        onBlur={() => handleFieldBlur('distanciaVaroes')}
                      />
                      {isNotApplicable(formData.distanciaVaroes) && (
                        <span className="text-[12px] text-gray-500 mt-1 block">Campo marcado como não aplicável</span>
                      )}
                    </div>
                  </form>
                )}
                
                {/* Aba Componentes */}
                {activeTab === 'Componentes' && (
                  <form className="space-y-4 animate-in fade-in duration-300">
                    {/* Cabeçalho compacto com totais */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                      <h4 className="text-[15px] font-medium text-[#111827]">Componentes</h4>
                      <div className="flex items-center gap-4 text-[13px]">
                        <span className="text-gray-600">
                          Peso: <strong>{(pesoManual.trim() !== '' ? parseFloat(pesoManual).toFixed(3) : pesoTotal.toFixed(3))} kg</strong>
                        </span>
                        <span className="text-gray-600">
                          Valor: <strong>R$ {(valorManual.trim() !== '' ? parseFloat(valorManual).toFixed(2) : valorTotal.toFixed(2))}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Lista de componentes em formato de tabela compacta */}
                    {componentes.length > 0 && (
                      <div className="space-y-2">
                        {componentes.map((componente, index) => (
                          <div key={componente.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            {/* Seleção do componente */}
                            <div className="col-span-6">
                              <select
                                value={componente.componenteId}
                                onChange={(e) => updateComponente(componente.id, 'componenteId', e.target.value)}
                                className="w-full h-8 px-2 border border-gray-300 rounded-lg text-[13px] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <option value="0">Selecionar componente...</option>
                                {componentesDisponiveis.map(comp => (
                                  <option key={comp.id} value={comp.id}>
                                    {comp.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantidade */}
                            <div className="col-span-2">
                              <input
                                type="number"
                                min="1"
                                value={componente.quantidade}
                                onChange={(e) => updateComponente(componente.id, 'quantidade', parseInt(e.target.value) || 1)}
                                className="w-full h-8 px-2 border border-gray-300 rounded-lg text-[13px] text-center appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Qtd"
                              />
                            </div>

                            {/* Peso e Valor calculados */}
                            <div className="col-span-3 flex items-center justify-between text-[13px] text-gray-600">
                              <span>{(componente.peso * componente.quantidade).toFixed(3)} kg</span>
                              <span>R$ {(componente.valor * componente.quantidade).toFixed(2)}</span>
                            </div>

                            {/* Botão remover */}
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeComponente(componente.id)}
                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botão adicionar componente */}
                    <button
                      type="button"
                      onClick={addComponente}
                      className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px]"
                    >
                      <span className="material-symbols-rounded text-[16px]">add</span>
                      Adicionar Componente
                    </button>

                    {/* Mensagem quando não há componentes */}
                    {componentes.length === 0 && (
                      <div className="text-center py-6">
                        <div className="text-gray-500 text-[13px] mb-1">Nenhum componente adicionado</div>
                        <div className="text-gray-400 text-[12px]">Use o botão acima para adicionar componentes</div>
                      </div>
                    )}
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
                    
                    {/* Volume Total e dimensões equivalentes */}
                    <div className="col-span-12 pt-4 border-t border-gray-200">
                      <h4 className="text-[15px] font-medium text-[#111827] mb-2">Volume Total</h4>
                      <div className="flex items-center gap-4 text-[13px] text-gray-700">
                        <span>Total: <strong>{totalVolumeCm3.toFixed(2)} cm³</strong></span>
                        <span>Dimensões equivalentes: <strong>{volumeSide.toFixed(2)} x {volumeSide.toFixed(2)} x {volumeSide.toFixed(2)}</strong> cm</span>
                      </div>
                    </div>
                  </form>
                )}
                
                {/* Aba Dados Adicionais */}
                {activeTab === 'Dados' && (
                  <form className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
                    {/* Card de Links Padrão */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Links Padrão</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center">
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5 cursor-pointer select-none">
                              Google Drive
                            </label>
                            <LightBulbIndicator fieldName="driveLink" />
                          </div>
                          <input
                            type="text"
                            placeholder="https://drive.google.com/..."
                            value={formData.driveLink}
                            onChange={(e) => handleFieldChange('driveLink', e.target.value)}
                            className={getFieldClasses(formData.driveLink)}
                            onFocus={() => setActiveField('driveLink')}
                            onBlur={() => handleFieldBlur('driveLink')}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5 cursor-pointer select-none">
                              Olist
                            </label>
                            <LightBulbIndicator fieldName="olistLink" />
                          </div>
                          <input
                            type="text"
                            placeholder="https://olist.com/..."
                            value={formData.olistLink}
                            onChange={(e) => handleFieldChange('olistLink', e.target.value)}
                            className={getFieldClasses(formData.olistLink)}
                            onFocus={() => setActiveField('olistLink')}
                            onBlur={() => handleFieldBlur('olistLink')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card de Links Personalizados */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Links Personalizados</h4>
                      <div className="space-y-3">
                        {customLinks.map(link => (
                          <div key={link.id} className="grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-5">
                              <input
                                type="text"
                                placeholder="Nome do link"
                                value={link.name}
                                onChange={(e) => updateCustomLink(link.id, 'name', e.target.value)}
                                className="w-full h-9 px-3 border border-gray-300 rounded-md text-[13px] focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div className="col-span-6">
                              <input
                                type="text"
                                placeholder="URL do link"
                                value={link.url}
                                onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                                className="w-full h-9 px-3 border border-gray-300 rounded-md text-[13px] focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeCustomLink(link.id)}
                                className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-md transition-colors"
                                title="Remover link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addCustomLink}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors text-[13px] font-medium"
                      >
                        <span className="material-symbols-rounded text-[16px]">add</span>
                        Adicionar Link
                      </button>
                    </div>

                    {/* Card de Observação */}
                    <div className="col-span-12 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center">
                        <h4 className="text-[15px] font-semibold text-gray-800 mb-3 cursor-pointer select-none">
                          Observação
                        </h4>
                        <LightBulbIndicator fieldName="observacao" />
                      </div>
                      <textarea
                        placeholder="Deixe aqui suas observações..."
                        value={formData.observacao}
                        onChange={(e) => handleFieldChange('observacao', e.target.value)}
                        className={getTextareaClasses(formData.observacao)}
                        onFocus={() => setActiveField('observacao')}
                        onBlur={() => handleFieldBlur('observacao')}
                      />
                    </div>
                  </form>
                )}
                
                {/* Placeholder para outras abas */}
                {activeTab !== 'Informações' && activeTab !== 'Medidas' && activeTab !== 'Componentes' && activeTab !== 'Embalagem' && activeTab !== 'Dados' && (
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




      {/* Modal de Visualização de Lembretes */}
      {viewModal.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setViewModal({ open: false, field: '' })}>
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  Lembretes - {viewModal.field}
                </h3>
                <p className="text-[12px] text-gray-600">
                  Gerencie lembretes e informações para este campo
                </p>
              </div>
              <button 
                onClick={() => setViewModal({ open: false, field: '' })} 
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Reminders Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[14px] font-medium text-gray-800">Lembretes</h4>
                    <button 
                      onClick={() => openEditModal(viewModal.field, 'reminder')}
                      className="text-[12px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Adicionar Lembrete
                    </button>
                  </div>
                  {fieldReminders[viewModal.field]?.reminders?.length > 0 ? (
                    <div className="space-y-2">
                      {fieldReminders[viewModal.field].reminders.map((reminder, index) => (
                        <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-800">
                          {reminder}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-500 italic">Nenhum lembrete adicionado</p>
                  )}
                </div>

                {/* Info Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[14px] font-medium text-gray-800">Informações</h4>
                    <button 
                      onClick={() => openEditModal(viewModal.field, 'info')}
                      className="text-[12px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {fieldReminders[viewModal.field]?.info ? 'Editar' : '+ Adicionar Informação'}
                    </button>
                  </div>
                  {fieldReminders[viewModal.field]?.info ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[13px] text-blue-800">
                      {fieldReminders[viewModal.field].info}
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-500 italic">Nenhuma informação adicionada</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={() => setViewModal({ open: false, field: '' })}
                className="px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={(e) => e.target === e.currentTarget && setEditModal({ open: false, field: '', type: 'reminder' })}>
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  {editModal.type === 'reminder' ? 'Lembrete' : 'Informações'} - {editModal.field}
                </h3>
                <p className="text-[12px] text-gray-600">
                  {editModal.type === 'reminder' ? 'Adicione um lembrete para este campo' : 'Adicione informações sobre este campo'}
                </p>
              </div>
              <button 
                onClick={() => setEditModal({ open: false, field: '', type: 'reminder' })} 
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={editModal.type === 'reminder' ? 'Digite o lembrete...' : 'Digite as informações...'}
                className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={() => setEditModal({ open: false, field: '', type: 'reminder' })}
                className="px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={saveFieldData}
                className="px-4 py-2 text-[14px] font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
