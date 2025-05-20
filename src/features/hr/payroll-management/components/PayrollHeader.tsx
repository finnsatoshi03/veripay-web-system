import { type FC } from 'react';
import { getCurrentPayrollPeriod, getNextCutOff } from '../lib/helper/helper';
import TableHeader from '@/components/table/table-header';

interface PayrollHeaderProps {
  referenceDate?: Date;
}

const PayrollHeader: FC<PayrollHeaderProps> = ({ referenceDate = new Date() }) => {
  const currentPayrollPeriod = getCurrentPayrollPeriod(referenceDate);
  const nextCutOff = getNextCutOff(referenceDate);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <TableHeader title="Payroll Management" />

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="text-gray-500">Current Payroll Period</p>
            <p className="font-semibold text-xl text-gray-900">{currentPayrollPeriod}</p>
          </div>
          <div>
            <p className="text-gray-500">Next Cut-off</p>
            <p className="font-semibold text-xl text-gray-900">{nextCutOff}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollHeader;