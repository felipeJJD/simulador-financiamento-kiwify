'use client'

import { useState } from 'react'
import { Calculator, Home, DollarSign, Calendar, User, Mail, Phone, FileText } from 'lucide-react'
import { calculateFinancing, formatCurrency } from '@/lib/calculations'
import { SimulationResult } from '@/types'
// import InputMask from 'react-input-mask'

interface SimulatorFormProps {
  onSimulationComplete: (data: any) => void
}

export default function SimulatorForm({ onSimulationComplete }: SimulatorFormProps) {
  const [propertyValue, setPropertyValue] = useState('')
  const [downPaymentPercentage, setDownPaymentPercentage] = useState('20')
  const [loanTerm, setLoanTerm] = useState('30')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!propertyValue || parseFloat(propertyValue.replace(/[^\d,]/g, '').replace(',', '.')) <= 0) {
      newErrors.propertyValue = 'Valor do imóvel é obrigatório'
    }

    if (!downPaymentPercentage || parseFloat(downPaymentPercentage) < 20) {
      newErrors.downPaymentPercentage = 'Entrada mínima de 20%'
    }

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email válido é obrigatório'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    }

    if (!cpf.trim() || cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF válido é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const propertyValueNum = parseFloat(propertyValue.replace(/[^\d,]/g, '').replace(',', '.'))
      const downPaymentNum = parseFloat(downPaymentPercentage)
      const loanTermNum = parseFloat(loanTerm)

      const result = calculateFinancing(propertyValueNum, downPaymentNum, loanTermNum)

      const simulationData = {
        ...result,
        name,
        email,
        phone,
        cpf,
        interestRate: 12,
        loanTerm: loanTermNum
      }

      onSimulationComplete(simulationData)
    } catch (error) {
      console.error('Erro na simulação:', error)
      setErrors({ general: 'Erro ao calcular financiamento' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatValueInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(numericValue) / 100 || 0)
  }

  const formatPhoneInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.length <= 2) {
      return numericValue
    } else if (numericValue.length <= 7) {
      return numericValue.replace(/(\d{2})(\d+)/, '($1) $2')
    } else if (numericValue.length <= 11) {
      return numericValue.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
    }
    return numericValue.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatCPFInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.length <= 3) {
      return numericValue
    } else if (numericValue.length <= 6) {
      return numericValue.replace(/(\d{3})(\d+)/, '$1.$2')
    } else if (numericValue.length <= 9) {
      return numericValue.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
    } else if (numericValue.length <= 11) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
    }
    return numericValue.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Simulador de Financiamento
        </h1>
        <p className="text-gray-600">
          Simule seu financiamento imobiliário de forma rápida e segura
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Imóvel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Dados do Imóvel
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Imóvel
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={propertyValue}
                onChange={(e) => setPropertyValue(formatValueInput(e.target.value))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                  errors.propertyValue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="R$ 0,00"
              />
            </div>
            {errors.propertyValue && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyValue}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrada (%)
              </label>
              <input
                type="number"
                min="20"
                max="80"
                value={downPaymentPercentage}
                onChange={(e) => setDownPaymentPercentage(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                  errors.downPaymentPercentage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.downPaymentPercentage && (
                <p className="text-red-500 text-sm mt-1">{errors.downPaymentPercentage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo (anos)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="15">15 anos</option>
                  <option value="20">20 anos</option>
                  <option value="25">25 anos</option>
                  <option value="30">30 anos</option>
                  <option value="35">35 anos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCPFInput(e.target.value))}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                  errors.cpf ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            {errors.cpf && (
              <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
            )}
          </div>
        </div>

        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{errors.general}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Simular Financiamento
            </>
          )}
        </button>
      </form>
    </div>
  )
}