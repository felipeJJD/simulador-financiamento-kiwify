'use client'

import { useState } from 'react'
import { CheckCircle, FileText, Download, ArrowLeft, PenTool } from 'lucide-react'
import { formatCurrency } from '@/lib/calculations'
import { SimulationData } from '@/types'
import SignatureModal from './SignatureModal'

interface SimulationResultProps {
  data: SimulationData
  onBack: () => void
  onAcceptProposal: (signature: string) => void
}

export default function SimulationResult({ data, onBack, onAcceptProposal }: SimulationResultProps) {
  const [showSignatureModal, setShowSignatureModal] = useState(false)

  const handleAcceptProposal = () => {
    setShowSignatureModal(true)
  }

  const handleSignatureComplete = (signature: string) => {
    setShowSignatureModal(false)
    onAcceptProposal(signature)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Simulação Concluída!</h1>
          </div>
          <p className="text-green-100">
            Sua proposta de financiamento foi calculada com sucesso
          </p>
        </div>

        {/* Dados do Cliente */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Nome:</span>
              <span className="ml-2 text-gray-900">{data.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-900">{data.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Telefone:</span>
              <span className="ml-2 text-gray-900">{data.phone}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">CPF:</span>
              <span className="ml-2 text-gray-900">{data.cpf}</span>
            </div>
          </div>
        </div>

        {/* Resumo da Simulação */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumo do Financiamento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Valor do Imóvel</h3>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(data.propertyValue)}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600 mb-1">Entrada</h3>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(data.downPayment)}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600 mb-1">Valor Financiado</h3>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(data.loanAmount)}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-600 mb-1">Parcela Mensal</h3>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(data.monthlyPayment)}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600 mb-1">Total a Pagar</h3>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(data.totalAmount)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Taxa de Juros</h3>
              <p className="text-2xl font-bold text-gray-900">
                {data.interestRate}% a.a.
              </p>
            </div>
          </div>

          {/* Detalhes Adicionais */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Detalhes do Financiamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Prazo:</span>
                <span className="ml-2 text-gray-900">{data.loanTerm} anos</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total de Parcelas:</span>
                <span className="ml-2 text-gray-900">{data.loanTerm * 12} parcelas</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total de Juros:</span>
                <span className="ml-2 text-gray-900">
                  {formatCurrency(data.totalAmount - data.loanAmount)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Sistema:</span>
                <span className="ml-2 text-gray-900">Tabela Price (SAC)</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Nova Simulação
            </button>

            <button
              onClick={handleAcceptProposal}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              <PenTool className="w-5 h-5" />
              Aceitar Proposta
            </button>
          </div>
        </div>
      </div>

      {showSignatureModal && (
        <SignatureModal
          onClose={() => setShowSignatureModal(false)}
          onSignatureComplete={handleSignatureComplete}
          simulationData={data}
        />
      )}
    </div>
  )
}