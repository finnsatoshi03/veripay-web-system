import { supabase } from "@/services/supabase";

// Types based on the database schema
export interface PayslipData {
  id: number;
  employee_id: number;
  payroll_id: number;
  basic_pay: number;
  gross_pay: number;
  net_pay: number;
  allowances: number;
  deductions: number;
  overtime_pay: number;
  status: string;
  remarks: string | null;
  issued_at: string;
  date_paid: string | null;
  cebuana_id: string | null;
  // Related data - matching actual API response (single objects)
  payrolls: {
    id: number;
    period_start: string;
    period_end: string;
    status: string;
    date_processed: string | null;
    notes?: string;
  };
  employees: {
    id: number;
    employee_code: string | null;
    users: {
      user_profiles: {
        first_name: string;
        last_name: string;
        profile_image: string | null;
        contact_number?: string;
        address?: string;
      };
    };
    departments?: {
      name: string;
    };
    positions?: {
      title: string;
      base_salary: number;
    };
  };
}

export interface PayslipSummary {
  totalPayslips: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalAllowances: number;
  averageNetPay: number;
  lastPayslipDate: string | null;
}

export interface PayslipQueryParams {
  employeeId?: number;
  payrollId?: number;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

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
  mandatoryDeductions?: MandatoryDeductionProp[];
}

export interface MandatoryDeductionProp {
  name: string;
  amountType: "fixed" | "percentage";
  value: number;
  calculatedAmount: number;
}

export interface DetailedPayslipData extends PayslipData {
  employee_benefits?: {
    id: number;
    benefit_id: number;
    value: number;
    effective_date: string;
    end_date: string | null;
    benefits: {
      id: number;
      name: string;
      type: string;
      description: string | null;
      amount_type: string;
      default_value: number | null;
      is_taxable: boolean | null;
      is_mandatory: boolean | null;
      is_deductible: boolean;
    }[];
  }[];
  mandatory_deductions?: {
    name: string;
    amount_type: string;
    value: number;
    calculated_amount: number;
  }[];
}

type ServiceError =
  | {
      message: string;
      code?: string;
      details?: string;
    }
  | string;

export const getRecentPayslip = async (
  employeeId: number,
): Promise<{
  success: boolean;
  data?: RecentPayslipProp;
  error?: ServiceError;
}> => {
  try {
    const { data: payslips, error } = await supabase
      .from("payslips")
      .select("*")
      .eq("employee_id", employeeId)
      .order("date_paid", { ascending: false })
      .limit(2);

    if (error) {
      console.error("Error fetching payslips:", error);
      return { success: false, error };
    }

    if (!payslips || payslips.length === 0) {
      return { success: false, error: "No payslips found for this employee." };
    }

    const recentPayslip = payslips[0];
    const previousPayslip = payslips.length > 1 ? payslips[1] : null;

    const grossPay = recentPayslip.gross_pay || 0;
    const netPay = recentPayslip.net_pay || 0;
    const totalDeductions = recentPayslip.deductions || 0;
    const totalAllowance = recentPayslip.allowances || 0;

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
    console.error("Unexpected error:", err);
    return { success: false, error: err as ServiceError };
  }
};

export const getPayslips = async (params: PayslipQueryParams = {}) => {
  try {
    const {
      employeeId,
      payrollId,
      page = 1,
      limit = 10,
      startDate,
      endDate,
      status,
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("payslips")
      .select(
        `
        id,
        employee_id,
        payroll_id,
        basic_pay,
        gross_pay,
        net_pay,
        allowances,
        deductions,
        overtime_pay,
        status,
        remarks,
        issued_at,
        date_paid,
        cebuana_id,
        payrolls!inner (
          id,
          period_start,
          period_end,
          status,
          date_processed
        ),
        employees!inner (
          id,
          employee_code,
          users!inner (
            user_profiles (
              first_name,
              last_name,
              profile_image
            )
          )
        )
      `,
      )
      .order("date_paid", { ascending: false })
      .range(from, to);

    // Apply filters
    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }

    if (payrollId) {
      query = query.eq("payroll_id", payrollId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (startDate && endDate) {
      query = query.gte("date_paid", startDate).lte("date_paid", endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching payslips:", error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Error in getPayslips:", error);
    throw error;
  }
};

export const getPayslipById = async (payslipId: number) => {
  try {
    const { data, error } = await supabase
      .from("payslips")
      .select(
        `
        id,
        employee_id,
        payroll_id,
        basic_pay,
        gross_pay,
        net_pay,
        allowances,
        deductions,
        overtime_pay,
        status,
        remarks,
        issued_at,
        date_paid,
        cebuana_id,
        payrolls!inner (
          id,
          period_start,
          period_end,
          status,
          date_processed,
          notes
        ),
        employees!inner (
          id,
          employee_code,
          users!inner (
            user_profiles (
              first_name,
              last_name,
              profile_image,
              contact_number,
              address
            )
          ),
          departments (
            name
          ),
          positions (
            title,
            base_salary
          )
        )
      `,
      )
      .eq("id", payslipId)
      .single();

    if (error) {
      console.error("Error fetching payslip:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getPayslipById:", error);
    throw error;
  }
};

export const getPayslipSummary = async (
  employeeId: number,
): Promise<PayslipSummary> => {
  try {
    const { data, error } = await supabase
      .from("payslips")
      .select("gross_pay, net_pay, deductions, allowances, date_paid")
      .eq("employee_id", employeeId)
      .not("date_paid", "is", null);

    if (error) {
      console.error("Error fetching payslip summary:", error);
      throw error;
    }

    const payslips = data || [];
    const totalPayslips = payslips.length;

    if (totalPayslips === 0) {
      return {
        totalPayslips: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalDeductions: 0,
        totalAllowances: 0,
        averageNetPay: 0,
        lastPayslipDate: null,
      };
    }

    const totals = payslips.reduce(
      (acc, payslip) => ({
        grossPay: acc.grossPay + (payslip.gross_pay || 0),
        netPay: acc.netPay + (payslip.net_pay || 0),
        deductions: acc.deductions + (payslip.deductions || 0),
        allowances: acc.allowances + (payslip.allowances || 0),
      }),
      { grossPay: 0, netPay: 0, deductions: 0, allowances: 0 },
    );

    const lastPayslipDate =
      payslips
        .map((p) => p.date_paid)
        .filter(Boolean)
        .sort()
        .pop() || null;

    return {
      totalPayslips,
      totalGrossPay: totals.grossPay,
      totalNetPay: totals.netPay,
      totalDeductions: totals.deductions,
      totalAllowances: totals.allowances,
      averageNetPay: totals.netPay / totalPayslips,
      lastPayslipDate,
    };
  } catch (error) {
    console.error("Error in getPayslipSummary:", error);
    throw error;
  }
};

export const getDetailedPayslipById = async (
  payslipId: number,
): Promise<DetailedPayslipData> => {
  try {
    // Get the payslip with all related data
    const { data: payslip, error: payslipError } = await supabase
      .from("payslips")
      .select(
        `
        id,
        employee_id,
        payroll_id,
        basic_pay,
        gross_pay,
        net_pay,
        allowances,
        deductions,
        overtime_pay,
        status,
        remarks,
        issued_at,
        date_paid,
        cebuana_id,
        payrolls!inner (
          id,
          period_start,
          period_end,
          status,
          date_processed,
          notes
        ),
        employees!inner (
          id,
          employee_code,
          users!inner (
            user_profiles (
              first_name,
              last_name,
              profile_image,
              contact_number,
              address
            )
          ),
          departments (
            name
          ),
          positions (
            title,
            base_salary
          )
        )
      `,
      )
      .eq("id", payslipId)
      .single();

    if (payslipError) {
      console.error("Error fetching payslip:", payslipError);
      throw payslipError;
    }

    // Get employee benefits for this employee with proper relationship to benefits table
    const { data: employeeBenefits, error: benefitsError } = await supabase
      .from("employee_benefits")
      .select(
        `
        id,
        benefit_id,
        value,
        effective_date,
        end_date,
        benefits!inner (
          id,
          name,
          type,
          description,
          amount_type,
          default_value,
          is_taxable,
          is_mandatory,
          is_deductible
        )
      `,
      )
      .eq("employee_id", payslip.employee_id)
      .is("end_date", null); // Only get active benefits

    if (benefitsError) {
      console.error("Error fetching employee benefits:", benefitsError);
    }

    // Get mandatory deductions
    const { data: deductions, error: deductionsError } = await supabase
      .from("deductions")
      .select("name, amount_type, value, is_taxable")
      .eq("is_active", true)
      .eq("type", "mandatory"); // Only get mandatory deductions

    if (deductionsError) {
      console.error("Error fetching deductions:", deductionsError);
    }

    // Calculate mandatory deductions for this payslip
    const mandatoryDeductions =
      deductions?.map((deduction) => {
        let calculatedAmount = 0;
        if (deduction.amount_type === "fixed") {
          calculatedAmount = deduction.value;
        } else if (deduction.amount_type === "percentage") {
          calculatedAmount = (deduction.value / 100) * payslip.basic_pay;
        }

        return {
          name: deduction.name,
          amount_type: deduction.amount_type,
          value: deduction.value,
          calculated_amount: calculatedAmount,
        };
      }) || [];

    return {
      ...payslip,
      employee_benefits: employeeBenefits || [],
      mandatory_deductions: mandatoryDeductions,
    } as unknown as DetailedPayslipData;
  } catch (error) {
    console.error("Error in getDetailedPayslipById:", error);
    throw error;
  }
};
