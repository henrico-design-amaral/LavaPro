import React from 'react';

interface ProductUsage {
  id: string;
  productName: string;
  unitOfMeasure: string;
  estimatedQuantity: number;
  wasteFactor: number;
  unitCost: number; // Cost per unit of measure
}

interface ChemicalCostCalculatorProps {
  usages: ProductUsage[];
  servicePrice: number;
}

export function ChemicalCostCalculator({ usages, servicePrice }: ChemicalCostCalculatorProps) {
  const calculations = usages.map(usage => {
    const realConsumption = usage.estimatedQuantity * usage.wasteFactor;
    const totalCost = realConsumption * usage.unitCost;
    return {
      ...usage,
      realConsumption,
      totalCost
    };
  });

  const totalChemicalCost = calculations.reduce((acc, curr) => acc + curr.totalCost, 0);
  const profitMargin = servicePrice - totalChemicalCost;
  const marginPercentage = servicePrice > 0 ? ((profitMargin / servicePrice) * 100).toFixed(1) : 0;

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Chemical Cost & Profitability</h3>
      
      <div className="space-y-4 mb-6">
        {calculations.map((calc) => (
          <div key={calc.id} className="flex justify-between items-center text-sm border-b pb-2">
            <div>
              <p className="font-medium">{calc.productName}</p>
              <p className="text-muted-foreground text-xs">
                {calc.estimatedQuantity}{calc.unitOfMeasure} × {calc.wasteFactor} (waste) = {calc.realConsumption.toFixed(2)}{calc.unitOfMeasure}
              </p>
            </div>
            <div className="text-right font-medium">
              R$ {calc.totalCost.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-md space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Chemical Cost:</span>
          <span className="font-semibold text-destructive">R$ {totalChemicalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Service Price:</span>
          <span className="font-medium text-foreground">R$ {servicePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
          <span>Gross Profit:</span>
          <span className={profitMargin > 0 ? "text-green-600" : "text-destructive"}>
            R$ {profitMargin.toFixed(2)} ({marginPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
}
