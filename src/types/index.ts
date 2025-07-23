export interface SimulationData {
  id?: string;
  propertyValue: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalAmount: number;
  interestRate: number;
  loanTerm: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  signature?: string;
  createdAt?: string;
}

export interface SimulationResult {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  loanAmount: number;
  downPayment: number;
  propertyValue: number;
}