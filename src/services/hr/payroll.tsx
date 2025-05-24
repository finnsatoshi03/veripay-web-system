import supabase from "@/lib/supabase";
import { format, parseISO, addDays } from 'date-fns';

export const generatePayroll = async () => {
  try {
    const periodStart = "2025-05-01";
    const periodEnd = "2025-05-30";
    const createdBy = 27; 

    const { error } = await supabase.rpc("generate_payroll", {
      p_period_start: periodStart,
      p_period_end: periodEnd,
      p_created_by: createdBy,
    });

    if (error) throw error;
    console.log("success");
    
    return "success"
  } catch (error) {
    console.log(error.message || "Something went wrong");
  }
};

// !! make it return instead of array in data just an object
// !! optimize too many unnecessary shits
// !! add types and interface 
// !! working, can be use for payroll summary and for the table of payroll management
export const getPayrollSummary = async () => {
  try {
    const { data: payrolls, error: payrollError } = await supabase
      .from('payrolls')
      .select(`
        *,
        payslips: payslips (*)
      `);

    if (payrollError) {
      console.error('Error fetching payrolls:', payrollError);
      return { success: false, error: payrollError };
    }

    const { data: mandatoryDeductions, error: dedError } = await supabase
      .from('deductions')
      .select('name, amount_type, value')
      .eq('is_active', true)
      .eq('type', 'mandatory');

    if (dedError) {
      console.error('Error fetching mandatory deductions:', dedError);
      return { success: false, error: dedError };
    }

    const payrollsWithDeductions = payrolls.map((payroll) => {
      const payslipsWithDeds = payroll.payslips.map((payslip) => {
        const deductions = mandatoryDeductions.map((ded) => {
          let amount = 0;
          if (ded.amount_type === 'fixed') {
            amount = ded.value;
          } else if (ded.amount_type === 'percentage') {
            amount = (ded.value / 100) * payslip.basic_pay;
          }
          return {
            name: ded.name,
            amount,
            displayValue:
              ded.amount_type === 'percentage'
                ? `${ded.value}%`
                : `${ded.value}`,
          };
        });

        const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

        return {
          ...payslip,
          mandatory_deductions: deductions,
          total_mandatory_deductions: totalDeductions,
        };
      });

      const periodStart = parseISO(payroll.period_start);
      const periodEnd = parseISO(payroll.period_end);
      const formattedPeriod = `${format(periodStart, 'MMMM dd')} - ${format(
        periodEnd,
        'dd, yyyy'
      )}`;

      const formattedDateProcessed = payroll.date_processed
        ? format(parseISO(payroll.date_processed), 'MMMM dd, yyyy')
        : null;

      return {
        ...payroll,
        period_formatted: formattedPeriod,
        date_processed_formatted: formattedDateProcessed,
        payslips: payslipsWithDeds,
      };
    });

    const processedPayrolls = payrolls.filter((p) => p.date_processed !== null);
    const sortedByDate = processedPayrolls.sort(
      (a, b) => new Date(b.date_processed) - new Date(a.date_processed)
    );
    const lastPayrollDateRaw = sortedByDate.length ? sortedByDate[0].date_processed : null;
    const lastPayrollDate = lastPayrollDateRaw
      ? format(parseISO(lastPayrollDateRaw), 'MMMM dd, yyyy')
      : null;

    let nextPayrollDateRaw;
    if (lastPayrollDateRaw) {
      const lastPayroll = sortedByDate[0];
      const lastPeriodEnd = parseISO(lastPayroll.period_end);
      nextPayrollDateRaw = addDays(lastPeriodEnd, 1).toISOString().split('T')[0];
    } else {
      nextPayrollDateRaw = new Date().toISOString().split('T')[0];
    }
    const nextPayrollDate = format(parseISO(nextPayrollDateRaw), 'MMMM dd, yyyy');

    return {
      success: true,
      data: payrollsWithDeductions,
      lastPayrollDate,
      nextPayrollDate,
      late_submissions: 0,
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
};


// rpc 

// CREATE OR REPLACE FUNCTION generate_payroll(p_period_start date, p_period_end date, p_created_by INT)
// RETURNS VOID AS $$
// DECLARE
//     new_payroll_id INT;
//     emp RECORD;
//     base_hourly NUMERIC;
//     total_hours NUMERIC;
//     regular_hours NUMERIC;
//     overtime_hours NUMERIC;
//     base_pay NUMERIC;
//     overtime_pay NUMERIC;
//     total_allowances NUMERIC := 0;
//     total_deductions NUMERIC;
//     gross_pay NUMERIC;
//     net_pay NUMERIC;
//     payslip_count INT := 0;

//     cumulative_gross_pay NUMERIC := 0;
//     cumulative_deductions NUMERIC := 0;
//     cumulative_net_pay NUMERIC := 0;
// BEGIN
//     -- Create new payroll
//     INSERT INTO payrolls (period_start, period_end, is_processed, status, created_by, created_at)
//     VALUES (p_period_start, p_period_end, FALSE, 'pending', p_created_by, NOW())
//     RETURNING id INTO new_payroll_id;

//     -- Process employees
//     FOR emp IN SELECT id, base_salary FROM employees WHERE status = 'active' LOOP
//         -- Get total worked hours
//         SELECT COALESCE(SUM(ar.total_hours), 0)
//         INTO total_hours
//         FROM attendance_records ar
//         WHERE employee_id = emp.id
//           AND date BETWEEN p_period_start AND p_period_end;

//         -- Calculate base hourly rate
//         base_hourly := emp.base_salary / (22 * 8); -- Assuming 22 workdays/month, 8h/day

//         -- Split regular vs overtime hours
//         IF total_hours > (22 * 8) THEN
//             regular_hours := 22 * 8;
//             overtime_hours := total_hours - regular_hours;
//         ELSE
//             regular_hours := total_hours;
//             overtime_hours := 0;
//         END IF;

//         -- Calculate base + overtime pay
//         base_pay := base_hourly * regular_hours;
//         overtime_pay := base_hourly * overtime_hours * 1.1; -- 10% overtime rate

//         -- Calculate allowances
//         -- No allowance calculations yet
//         -- Calculate mandatory deductions
//         SELECT COALESCE(SUM(
//             CASE d.amount_type
//                 WHEN 'fixed' THEN d.value
//                 WHEN 'percentage' THEN (d.value / 100) * emp.base_salary
//                 ELSE 0
//             END
//         ), 0)
//         INTO total_deductions
//         FROM deductions d
//         WHERE d.is_active = TRUE
//           AND d.type = 'mandatory';

//         -- Compute totals
//         gross_pay := base_pay + overtime_pay + total_allowances;
//         net_pay := gross_pay - total_deductions;

//         -- Insert payslip
//         INSERT INTO payslips (
//             employee_id, payroll_id, basic_pay, gross_pay, net_pay, allowances, deductions, net_salary, status
//         )
//         VALUES (
//             emp.id, new_payroll_id, base_pay, gross_pay, net_pay, total_allowances, total_deductions, net_pay, 'paid'
//         );

//         -- Increment payslip count
//         payslip_count := payslip_count + 1;

//         cumulative_gross_pay := cumulative_gross_pay + gross_pay;
//         cumulative_deductions := cumulative_deductions + total_deductions;
//         cumulative_net_pay := cumulative_net_pay + net_pay;
//     END LOOP;

//     -- Update payroll summary and mark as paid
//     UPDATE payrolls
//     SET is_processed = TRUE,
//         date_processed = NOW(),
//         total_gross_pay = cumulative_gross_pay,
//         total_deductions = cumulative_deductions,
//         total_net_pay = cumulative_net_pay,
//         status = 'paid',
//         notes = CONCAT('Generated ', payslip_count, ' payslips'),
//         total_employees = payslip_count
//     WHERE id = new_payroll_id;

// END;
// $$ LANGUAGE plpgsql;

