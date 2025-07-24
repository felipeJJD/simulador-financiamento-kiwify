'use client'

import { useState } from 'react'
import SimulatorForm from '@/components/SimulatorForm'
import SimulationResult from '@/components/SimulationResult'
import { SimulationData } from '@/types'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form')
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null)

  const handleSimulationComplete = (data: SimulationData) => {
    setSimulationData(data)
    setCurrentStep('result')
  }

  const handleBack = () => {
    setCurrentStep('form')
    setSimulationData(null)
  }

  const generatePDF = (data: SimulationData) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text('PROPOSTA DE FINANCIAMENTO IMOBILIÁRIO', 20, 30)
    
    // Line
    doc.setDrawColor(0, 102, 204)
    doc.line(20, 35, 190, 35)
    
    // Client data
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('DADOS DO CLIENTE', 20, 50)
    
    doc.setFontSize(10)
    doc.text(`Nome: ${data.name}`, 20, 60)
    doc.text(`CPF: ${data.cpf}`, 20, 67)
    doc.text(`Email: ${data.email}`, 20, 74)
    doc.text(`Telefone: ${data.phone}`, 20, 81)
    
    // Financing details
    doc.setFontSize(14)
    doc.text('DETALHES DO FINANCIAMENTO', 20, 100)
    
    doc.setFontSize(10)
    doc.text(`Valor do Imóvel: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.propertyValue)}`, 20, 110)
    doc.text(`Entrada: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.downPayment)}`, 20, 117)
    doc.text(`Valor Financiado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.loanAmount)}`, 20, 124)
    doc.text(`Parcela Mensal: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.monthlyPayment)}`, 20, 131)
    doc.text(`Total a Pagar: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalAmount)}`, 20, 138)
    doc.text(`Taxa de Juros: ${data.interestRate}% a.a.`, 20, 145)
    doc.text(`Prazo: ${data.loanTerm} anos (${data.loanTerm * 12} parcelas)`, 20, 152)
    
    // Signature
    if (data.signature) {
      doc.setFontSize(14)
      doc.text('ASSINATURA DIGITAL', 20, 180)
      
      // Add signature image
      doc.addImage(data.signature, 'PNG', 20, 190, 100, 40)
    }
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Documento gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 280)
    doc.text('Este documento possui validade legal para fins de proposta de financiamento.', 20, 285)
    
    return doc
  }

  const handleAcceptProposal = async (signature: string) => {
    if (!simulationData) return

    const dataWithSignature = {
      name: simulationData.name,
      email: simulationData.email,
      phone: simulationData.phone,
      cpf: simulationData.cpf,
      property_value: simulationData.propertyValue,
      down_payment: simulationData.downPayment,
      loan_amount: simulationData.loanAmount,
      monthly_payment: simulationData.monthlyPayment,
      total_amount: simulationData.totalAmount,
      interest_rate: simulationData.interestRate,
      loan_term: simulationData.loanTerm,
      signature,
      created_at: new Date().toISOString()
    }

    try {
      // Save to database
      const { error } = await supabase
        .from('simulations')
        .insert([dataWithSignature])

      if (error) {
        console.error('Erro ao salvar no banco:', error)
        alert('Erro ao salvar no banco de dados. O PDF será gerado mesmo assim.')
      } else {
        console.log('Dados salvos com sucesso no banco!')
      }

      // Generate and download PDF
      const pdf = generatePDF(simulationData)
      pdf.save(`proposta-financiamento-${simulationData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)

      // Show success message
      alert('Proposta aceita com sucesso! O PDF foi baixado automaticamente.')
      
    } catch (error) {
      console.error('Erro ao processar proposta:', error)
      alert('Erro ao processar proposta. Tente novamente.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      {currentStep === 'form' && (
        <SimulatorForm onSimulationComplete={handleSimulationComplete} />
      )}
      
      {currentStep === 'result' && simulationData && (
        <SimulationResult
          data={simulationData}
          onBack={handleBack}
          onAcceptProposal={handleAcceptProposal}
        />
      )}
    </main>
  )
}