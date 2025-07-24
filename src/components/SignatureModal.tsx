'use client'

import { useRef, useState } from 'react'
import { X, RotateCcw, Check } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'
import { SimulationData } from '@/types'

interface SignatureModalProps {
  onClose: () => void
  onSignatureComplete: (signature: string) => void
  simulationData: SimulationData
}

export default function SignatureModal({ onClose, onSignatureComplete, simulationData }: SignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const handleClear = () => {
    signatureRef.current?.clear()
    setIsEmpty(true)
  }

  const handleEnd = () => {
    setIsEmpty(signatureRef.current?.isEmpty() || false)
  }

  const handleConfirm = () => {
    if (signatureRef.current && !isEmpty) {
      const signatureData = signatureRef.current.toDataURL()
      onSignatureComplete(signatureData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assinatura Digital</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirmação da Proposta de Financiamento
            </h3>
            <p className="text-gray-600 text-sm">
              Ao assinar digitalmente, você confirma que concorda com os termos da proposta de financiamento apresentada.
            </p>
          </div>

          {/* Resumo da Proposta */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Resumo da Proposta</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cliente:</span>
                <span className="ml-2 font-medium">{simulationData.name}</span>
              </div>
              <div>
                <span className="text-gray-600">CPF:</span>
                <span className="ml-2 font-medium">{simulationData.cpf}</span>
              </div>
              <div>
                <span className="text-gray-600">Valor do Imóvel:</span>
                <span className="ml-2 font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationData.propertyValue)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Parcela Mensal:</span>
                <span className="ml-2 font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationData.monthlyPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Área de Assinatura */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assine no campo abaixo:
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'w-full h-40 bg-white rounded border',
                  width: 600,
                  height: 160
                }}
                onEnd={handleEnd}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use o mouse ou toque na tela para assinar
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Limpar
            </button>

            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              disabled={isEmpty}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              <Check className="w-4 h-4" />
              Confirmar Assinatura
            </button>
          </div>

          {/* Termos */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Importante:</strong> Esta assinatura digital tem validade legal e confirma sua concordância com os termos da proposta de financiamento. 
              Certifique-se de ter lido e compreendido todos os detalhes antes de assinar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}