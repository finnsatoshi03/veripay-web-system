import supabase from "@/lib/supabase";
import { format, parseISO } from 'date-fns';

export interface RecentPayslipProp {
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  totalAllowance: number;
  percentageIncrease: number | null;
}

export interface PayslipProp {
  id: number;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  totalAllowance: number;
  percentageNet: number;
  percentageDeductions: number;
  datePaid: string | null;
  status: string;
  period: string;
}

export interface PayslipQueryParams {
  employeeId: number;
  page?: number;
  limit?: number;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
}

export interface MandatoryDeductionProp {
  name: string;
  amountType: 'fixed' | 'percentage';
  value: number;
  calculatedAmount: number;
}

export const getRecentPayslip = async (
  employeeId: number
): Promise<{ success: boolean; data?: RecentPayslipProp; error?: any }> => {
  try {
    const { data: payslips, error } = await supabase
      .from('payslips')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date_paid', { ascending: false })
      .limit(2); // get latest + previous

    if (error) {
      console.error('Error fetching payslips:', error);
      return { success: false, error };
    }

    if (!payslips || payslips.length === 0) {
      return { success: false, error: 'No payslips found for this employee.' };
    }

    const recentPayslip = payslips[0];
    const previousPayslip = payslips.length > 1 ? payslips[1] : null;

    const grossPay = recentPayslip.gross_pay || 0;
    const netPay = recentPayslip.net_pay || 0;
    const totalDeductions = recentPayslip.deductions || 0;
    const totalAllowance = recentPayslip.allowance || 0;

    let percentageIncrease: number | null = null;
    if (previousPayslip) {
      const previousNet = previousPayslip.net_pay || 0;
      if (previousNet > 0) {
        percentageIncrease = ((netPay - previousNet) / previousNet) * 100;
      } else {
        percentageIncrease = 100;
      }
    }

    return {
      success: true,
      data: {
        grossPay,
        netPay,
        totalDeductions,
        totalAllowance,
        percentageIncrease,
      },
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
};

export const getPayslips = async ({
  employeeId,
  page = 1,
  limit = 10,
  startDate,
  endDate,
}: PayslipQueryParams): Promise<{ success: boolean; data?: PayslipProp[]; error?: any }> => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch payslips
    let query = supabase
      .from('payslips')
      .select(
        `
        *,
        payrolls: payroll_id (
          period_start,
          period_end,
          status,
          date_processed
        )
      `
      )
      .eq('employee_id', employeeId)
      .order('date_paid', { ascending: false })
      .range(from, to);

    if (startDate && endDate) {
      query = query.gte('date_paid', startDate).lte('date_paid', endDate);
    }

    const { data: payslips, error: payslipError } = await query;

    if (payslipError) {
      console.error('Error fetching payslips:', payslipError);
      return { success: false, error: payslipError };
    }

    // Fetch active mandatory deductions
    const { data: mandatoryDeductions, error: deductionError } = await supabase
      .from('deductions')
      .select('name, amount_type, value')
      .eq('is_active', true)
      .eq('type', 'mandatory');

    if (deductionError) {
      console.error('Error fetching mandatory deductions:', deductionError);
      return { success: false, error: deductionError };
    }

    const processedPayslips: PayslipProp[] = payslips.map((payslip) => {
      const gross = payslip.gross_pay || 0;
      const net = payslip.net_pay || 0;
      const deductions = payslip.deductions || 0;
      const allowance = payslip.allowance || 0;

      const percentageNet = gross > 0 ? (net / gross) * 100 : 0;
      const percentageDeductions = gross > 0 ? (deductions / gross) * 100 : 0;

      const periodStart = parseISO(payslip.payrolls.period_start);
      const periodEnd = parseISO(payslip.payrolls.period_end);
      const formattedPeriod = `${format(periodStart, 'MMMM dd')}-${format(periodEnd, 'dd, yyyy')}`;

      const datePaid = payslip.payrolls.date_processed
        ? format(parseISO(payslip.payrolls.date_processed), 'MMMM dd, yyyy')
        : null;

      const mappedDeductions = mandatoryDeductions.map((ded) => {
        let calculatedAmount = 0;
        if (ded.amount_type === 'fixed') {
          calculatedAmount = ded.value;
        } else if (ded.amount_type === 'percentage') {
          calculatedAmount = (ded.value / 100) * payslip.basic_pay;
        }
        return {
          name: ded.name,
          amountType: ded.amount_type,
          value: ded.value,
          calculatedAmount,
        };
      });

      return {
        id: payslip.id,
        grossPay: gross,
        netPay: net,
        totalDeductions: deductions,
        totalAllowance: allowance,
        percentageNet,
        percentageDeductions,
        datePaid,
        status: payslip.payrolls.status || 'unknown',
        period: formattedPeriod,
        mandatoryDeductions: mappedDeductions,
      };
    });

    return { success: true, data: processedPayslips };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
};
