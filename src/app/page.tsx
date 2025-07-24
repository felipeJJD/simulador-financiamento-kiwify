'use client'

import React, { useState } from 'react'
import SimulatorForm from '@/components/SimulatorForm'
import SimulationResult from '@/components/SimulationResult'
import { SimulationData } from '@/types'
import { supabase, testSupabaseConnection } from '@/lib/supabase-client'
import jsPDF from 'jspdf'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form')
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null)

  // Testar conectividade na inicialização
  React.useEffect(() => {
    testSupabaseConnection()
  }, [])

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
      console.log('Tentando salvar no Supabase...', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })

      // Save to database with retry logic
      let saveSuccess = false
      let attempts = 0
      const maxAttempts = 3

      while (!saveSuccess && attempts < maxAttempts) {
        attempts++
        console.log(`Tentativa ${attempts} de ${maxAttempts}`)

        try {
          const { data, error } = await supabase
            .from('simulations')
            .insert([dataWithSignature])
            .select()

          if (error) {
            console.error(`Erro na tentativa ${attempts}:`, {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            })
            
            if (attempts === maxAttempts) {
              throw error
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
          } else {
            console.log('Dados salvos com sucesso:', data)
            saveSuccess = true
          }
        } catch (networkError) {
          console.error(`Erro de rede na tentativa ${attempts}:`, networkError)
          
          if (attempts === maxAttempts) {
            throw networkError
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000 * attempts))
        }
      }

      if (!saveSuccess) {
        console.warn('Falha ao salvar no banco após todas as tentativas')
        alert('Não foi possível salvar no banco de dados, mas o PDF será gerado.')
      }

      // Generate and download PDF
      const pdf = generatePDF(simulationData)
      pdf.save(`proposta-financiamento-${simulationData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)

      // Show success message
      const message = saveSuccess 
        ? 'Proposta aceita com sucesso! Dados salvos e PDF baixado.'
        : 'PDF gerado com sucesso! (Dados não foram salvos no banco)'
      alert(message)
      
    } catch (error) {
      console.error('Erro crítico ao processar proposta:', error)
      
      // Still generate PDF even if database fails
      try {
        const pdf = generatePDF(simulationData)
        pdf.save(`proposta-financiamento-${simulationData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
        alert('Erro ao salvar dados, mas PDF foi gerado. Tente novamente mais tarde.')
      } catch (pdfError) {
        console.error('Erro ao gerar PDF:', pdfError)
        alert('Erro ao processar proposta. Tente novamente.')
      }
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