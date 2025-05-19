import HeaderSection from '@/components/custom/common/HeaderSection';

const PayrollHeader = () => {

    // For demonstration - in a real app, these would come from your data source
    const currentPayrollPeriod = "May 1-15, 2025";
    const nextCutOff = "May 15, 2025";

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <HeaderSection title="Payroll Management" />

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