import { SimulationResult } from '@/types'

export function calculateFinancing(
  propertyValue: number,
  downPaymentPercentage: number,
  loanTermYears: number,
  annualInterestRate: number = 0.12
): SimulationResult {
  // Validações
  if (downPaymentPercentage < 20) {
    throw new Error('Entrada mínima de 20% é obrigatória')
  }

  const downPayment = propertyValue * (downPaymentPercentage / 100)
  const loanAmount = propertyValue - downPayment
  
  // Taxa mensal
  const monthlyRate = annualInterestRate / 12
  const totalMonths = loanTermYears * 12
  
  // Cálculo da parcela usando a fórmula de amortização francesa (SAC)
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1)
  
  const totalAmount = monthlyPayment * totalMonths
  const totalInterest = totalAmount - loanAmount

  return {
    propertyValue,
    downPayment,
    loanAmount,
    monthlyPayment,
    totalAmount,
    totalInterest
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}