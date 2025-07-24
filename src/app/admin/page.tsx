'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, Calendar, Download, Eye, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SimulationData } from '@/types'
import { formatCurrency } from '@/lib/calculations'

export default function AdminPanel() {
  const [simulations, setSimulations] = useState<SimulationData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSimulation, setSelectedSimulation] = useState<any | null>(null)

  useEffect(() => {
    fetchSimulations()
  }, [])

  const fetchSimulations = async () => {
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar simulações:', error)
        return
      }

      setSimulations(data || [])
    } catch (error) {
      console.error('Erro ao buscar simulações:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSimulations = simulations.filter(sim =>
    sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sim.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sim.cpf.includes(searchTerm)
  )

  const totalSimulations = simulations.length
  const totalValue = simulations.reduce((sum, sim: any) => sum + (sim.property_value || 0), 0)
  const averageValue = totalSimulations > 0 ? totalValue / totalSimulations : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie as simulações de financiamento</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Simulações</p>
                <p className="text-2xl font-bold text-gray-900">{totalSimulations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchSimulations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Atualizar
            </button>
          </div>
        </div>

        {/* Simulations Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Simulações ({filteredSimulations.length})
            </h2>
          </div>

          {filteredSimulations.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma simulação encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor do Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcela Mensal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSimulations.map((simulation: any) => (
                    <tr key={simulation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {simulation.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {simulation.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {simulation.cpf}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(simulation.property_value || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(simulation.monthly_payment || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {simulation.created_at ? new Date(simulation.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedSimulation(simulation)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Detalhes da Simulação</h3>
                <button
                  onClick={() => setSelectedSimulation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="text-sm text-gray-900">{selectedSimulation.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedSimulation.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="text-sm text-gray-900">{selectedSimulation.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <p className="text-sm text-gray-900">{selectedSimulation.cpf}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor do Imóvel</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedSimulation.property_value || 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entrada</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedSimulation.down_payment || 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valor Financiado</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedSimulation.loan_amount || 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parcela Mensal</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedSimulation.monthly_payment || 0)}</p>
                  </div>
                </div>

                {selectedSimulation.signature && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assinatura</label>
                    <img 
                      src={selectedSimulation.signature} 
                      alt="Assinatura" 
                      className="border rounded-lg max-w-full h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}